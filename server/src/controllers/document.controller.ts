import { Request, Response, NextFunction } from 'express';
import prisma from '../database/client';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  isCloudinaryConfigured,
  uploadDocumentToCloudinary,
  generateSignedDocumentPreviewUrl,
  deleteDocumentFromCloudinary,
} from '../config/cloudinary';

/**
 * Verify whether the requesting user (Admin or Customer) has authorization over the given Enquiry
 */
async function verifyEnquiryAccess(
  req: AuthenticatedRequest,
  enquiryIdOrRef: string,
  customerIdentifier?: string
): Promise<{ authorized: boolean; enquiry: any | null; role: 'admin' | 'customer' | 'none' }> {
  const enquiry = await prisma.enquiry.findFirst({
    where: {
      OR: [
        { id: enquiryIdOrRef },
        { referenceNumber: enquiryIdOrRef },
      ],
    },
    include: { customer: true },
  });

  if (!enquiry) {
    return { authorized: false, enquiry: null, role: 'none' };
  }

  // 1. Admin is always authorized
  if (req.admin && req.admin.id) {
    return { authorized: true, enquiry, role: 'admin' };
  }

  // 2. Authenticated Customer
  if (req.customer && req.customer.id) {
    const isOwner =
      enquiry.customerId === req.customer.id ||
      (req.customer.email && enquiry.email && enquiry.email.toLowerCase() === req.customer.email.toLowerCase()) ||
      (req.customer.phone && enquiry.mobileNumber && enquiry.mobileNumber.replace(/\D/g, '').endsWith(req.customer.phone.replace(/\D/g, '').slice(-10)));

    if (isOwner) {
      return { authorized: true, enquiry, role: 'customer' };
    }
  }

  // 3. Fallback verification via direct phone / reference ownership proof (e.g. guest intake)
  if (customerIdentifier) {
    const cleanId = customerIdentifier.replace(/\D/g, '').slice(-10);
    const cleanEnqPhone = (enquiry.mobileNumber || '').replace(/\D/g, '').slice(-10);
    if (cleanId && cleanEnqPhone && cleanId === cleanEnqPhone) {
      return { authorized: true, enquiry, role: 'customer' };
    }
  }

  return { authorized: false, enquiry, role: 'none' };
}

/**
 * Upload single or multiple documents for an enquiry
 * POST /api/documents/upload
 */
export async function uploadEnquiryDocument(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  let uploadedCloudinaryId: string | null = null;
  let uploadedResourceType: string = 'image';

  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const singleFile = req.file;
    const fileList = files && files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (fileList.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No document file was uploaded. Please attach a JPG, PNG, or PDF file.',
      });
      return;
    }

    const { enquiryId, enquiryReference, documentName, category, customerIdentifier } = req.body;
    const targetEnquiryParam = enquiryId || enquiryReference;

    if (!targetEnquiryParam) {
      res.status(400).json({
        success: false,
        message: 'Missing required parameter: enquiryId or enquiryReference.',
      });
      return;
    }

    // Verify Authorization
    const { authorized, enquiry, role } = await verifyEnquiryAccess(
      req,
      targetEnquiryParam,
      customerIdentifier
    );

    if (!authorized || !enquiry) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to upload documents for this loan enquiry.',
      });
      return;
    }

    if (!isCloudinaryConfigured()) {
      res.status(503).json({
        success: false,
        message: 'Cloudinary storage credentials are not yet configured on the server. Please provide CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
      });
      return;
    }

    const createdRecords = [];

    for (const file of fileList) {
      const docName = documentName || file.originalname.replace(/\.[^/.]+$/, '');
      const docCategory = category || 'KYC';

      // 1. Upload to Cloudinary under structured path
      const cloudinaryResult = await uploadDocumentToCloudinary(file.buffer, {
        enquiryReference: enquiry.referenceNumber,
        category: docCategory,
        documentName: docName,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
      });

      uploadedCloudinaryId = cloudinaryResult.publicId;
      uploadedResourceType = cloudinaryResult.resourceType;

      // 2. Persist metadata in MySQL EnquiryDocument table
      try {
        const savedDoc = await prisma.enquiryDocument.create({
          data: {
            enquiryId: enquiry.id,
            documentName: docName,
            category: docCategory,
            cloudinaryPublicId: cloudinaryResult.publicId,
            resourceType: cloudinaryResult.resourceType,
            fileFormat: cloudinaryResult.format,
            fileSize: cloudinaryResult.bytes,
            originalFilename: file.originalname,
            uploadedBy: role === 'admin' ? 'admin' : 'customer',
          },
        });

        // Generate immediate short-lived preview URL
        const previewUrl = generateSignedDocumentPreviewUrl(
          savedDoc.cloudinaryPublicId,
          savedDoc.resourceType,
          savedDoc.fileFormat || undefined,
          3600
        );

        createdRecords.push({
          ...savedDoc,
          previewUrl,
        });
      } catch (dbErr) {
        // Rollback Cloudinary asset if database insertion fails
        console.error('Database insertion failed for document, cleaning up Cloudinary asset:', dbErr);
        if (uploadedCloudinaryId) {
          await deleteDocumentFromCloudinary(uploadedCloudinaryId, uploadedResourceType);
        }
        throw dbErr;
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully uploaded ${createdRecords.length} document(s) to secure Cloudinary vault.`,
      data: createdRecords.length === 1 ? createdRecords[0] : createdRecords,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieve all documents associated with an enquiry
 * GET /api/documents/enquiry/:enquiryId
 */
export async function getEnquiryDocuments(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { enquiryId } = req.params;
    const { customerIdentifier } = req.query;

    const { authorized, enquiry } = await verifyEnquiryAccess(
      req,
      enquiryId,
      typeof customerIdentifier === 'string' ? customerIdentifier : undefined
    );

    if (!authorized || !enquiry) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view documents for this loan enquiry.',
      });
      return;
    }

    const documents = await prisma.enquiryDocument.findMany({
      where: { enquiryId: enquiry.id },
      orderBy: { createdAt: 'desc' },
    });

    // Generate fresh signed URLs for each authenticated document
    const documentsWithSignedUrls = documents.map((doc) => ({
      ...doc,
      previewUrl: generateSignedDocumentPreviewUrl(
        doc.cloudinaryPublicId,
        doc.resourceType,
        doc.fileFormat || undefined,
        3600 // 1 hour
      ),
    }));

    res.json({
      success: true,
      data: documentsWithSignedUrls,
      enquiry: {
        id: enquiry.id,
        referenceNumber: enquiry.referenceNumber,
        fullName: enquiry.fullName,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Generate a fresh short-lived signed preview URL for an existing document
 * GET /api/documents/:documentId/preview
 */
export async function getDocumentPreviewUrl(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { documentId } = req.params;
    const { customerIdentifier } = req.query;

    const doc = await prisma.enquiryDocument.findUnique({
      where: { id: documentId },
      include: { enquiry: true },
    });

    if (!doc) {
      res.status(404).json({ success: false, message: 'Document record not found' });
      return;
    }

    const { authorized } = await verifyEnquiryAccess(
      req,
      doc.enquiryId,
      typeof customerIdentifier === 'string' ? customerIdentifier : undefined
    );

    if (!authorized) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to preview this document.',
      });
      return;
    }

    const signedUrl = generateSignedDocumentPreviewUrl(
      doc.cloudinaryPublicId,
      doc.resourceType,
      doc.fileFormat || undefined,
      3600
    );

    res.json({
      success: true,
      data: {
        documentId: doc.id,
        documentName: doc.documentName,
        category: doc.category,
        format: doc.fileFormat,
        resourceType: doc.resourceType,
        previewUrl: signedUrl,
        expiresIn: 3600,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a document from Cloudinary and database
 * DELETE /api/documents/:documentId
 */
export async function deleteEnquiryDocument(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { documentId } = req.params;

    const doc = await prisma.enquiryDocument.findUnique({
      where: { id: documentId },
      include: { enquiry: true },
    });

    if (!doc) {
      res.status(404).json({ success: false, message: 'Document not found' });
      return;
    }

    // Only Admin or Enquiry Customer owner can delete documents
    const { authorized } = await verifyEnquiryAccess(req, doc.enquiryId);

    if (!authorized) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to delete this document.',
      });
      return;
    }

    // 1. Delete from Cloudinary
    await deleteDocumentFromCloudinary(doc.cloudinaryPublicId, doc.resourceType);

    // 2. Delete from Database
    await prisma.enquiryDocument.delete({
      where: { id: documentId },
    });

    res.json({
      success: true,
      message: 'Document successfully removed from Cloudinary and database.',
      data: { documentId },
    });
  } catch (err) {
    next(err);
  }
}
