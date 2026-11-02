import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

// Configure official Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

/**
 * Check whether Cloudinary environment variables are configured
 */
export function isCloudinaryConfigured(): boolean {
  const name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const key = process.env.CLOUDINARY_API_KEY?.trim();
  const secret = process.env.CLOUDINARY_API_SECRET?.trim();
  return Boolean(name && key && secret);
}

export interface CloudinaryUploadResult {
  publicId: string;
  resourceType: string;
  format: string;
  bytes: number;
  originalFilename?: string;
}

/**
 * Upload a document buffer stream to Cloudinary under structured loan-documents folder
 */
export async function uploadDocumentToCloudinary(
  buffer: Buffer,
  options: {
    enquiryReference: string;
    category: string;
    documentName: string;
    originalFilename?: string;
    mimeType?: string;
  }
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary credentials are not configured on the server. Please provide CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }

  const safeRef = options.enquiryReference.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeCat = (options.category || 'general').toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeDocName = options.documentName.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
  
  // Folder structure: loan-documents/enquiries/REF/category
  const folder = `loan-documents/enquiries/${safeRef}/${safeCat}`;
  const publicId = `${safeDocName}_${Date.now()}`;

  // Determine resource type: PDFs can be uploaded as 'image' (which allows rasterized page previews) or 'raw'
  const isPdf = options.mimeType === 'application/pdf' || options.originalFilename?.toLowerCase().endsWith('.pdf');
  const resourceType: 'image' | 'raw' | 'auto' = isPdf ? 'image' : 'auto';

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        type: 'authenticated', // Authenticated delivery for sensitive loan KYC & property records
        overwrite: true,
        tags: ['loan-document', safeRef, safeCat],
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(error || new Error('Cloudinary upload returned empty response'));
        }
        resolve({
          publicId: result.public_id,
          resourceType: result.resource_type || (isPdf ? 'image' : 'raw'),
          format: result.format || (isPdf ? 'pdf' : 'jpg'),
          bytes: result.bytes || buffer.length,
          originalFilename: options.originalFilename,
        });
      }
    );

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
}

/**
 * Upload a Base64 string directly to Cloudinary (used for migration of legacy documents)
 */
export async function uploadBase64ToCloudinary(
  base64Data: string,
  options: {
    enquiryReference: string;
    category: string;
    documentName: string;
    originalFilename?: string;
  }
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary credentials are not configured on the server.');
  }

  const safeRef = options.enquiryReference.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeCat = (options.category || 'general').toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeDocName = options.documentName.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
  const folder = `loan-documents/enquiries/${safeRef}/${safeCat}`;
  const publicId = `${safeDocName}_${Date.now()}`;

  const isPdf = base64Data.startsWith('data:application/pdf') || options.originalFilename?.toLowerCase().endsWith('.pdf');
  const resourceType = isPdf ? 'image' : 'auto';

  const result = await cloudinary.uploader.upload(base64Data, {
    folder,
    public_id: publicId,
    resource_type: resourceType,
    type: 'authenticated',
    overwrite: true,
    tags: ['loan-document', 'migrated', safeRef, safeCat],
  });

  return {
    publicId: result.public_id,
    resourceType: result.resource_type,
    format: result.format || (isPdf ? 'pdf' : 'jpg'),
    bytes: result.bytes,
    originalFilename: options.originalFilename,
  };
}

/**
 * Generate a short-lived cryptographically signed URL for authenticated document preview (1 hour expiry)
 */
export function generateSignedDocumentPreviewUrl(
  publicId: string,
  resourceType: string = 'image',
  format?: string,
  expiresInSeconds: number = 3600
): string {
  if (!isCloudinaryConfigured()) {
    return '';
  }

  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

  try {
    // Generate signed download URL for 'authenticated' resource type
    const signedUrl = cloudinary.utils.private_download_url(publicId, format || '', {
      resource_type: (resourceType as any) || 'image',
      type: 'authenticated',
      expires_at: expiresAt,
    });
    return signedUrl;
  } catch (err) {
    // Fallback: standard signed url
    return cloudinary.url(publicId, {
      resource_type: resourceType,
      type: 'authenticated',
      sign_url: true,
      secure: true,
      format: format,
    });
  }
}

/**
 * Delete an asset permanently from Cloudinary
 */
export async function deleteDocumentFromCloudinary(
  publicId: string,
  resourceType: string = 'image'
): Promise<boolean> {
  if (!isCloudinaryConfigured()) {
    return true; // No-op if not configured
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      type: 'authenticated',
      invalidate: true,
    });
    return res.result === 'ok' || res.result === 'not found';
  } catch (err) {
    console.error('Failed to delete asset from Cloudinary:', err);
    return false;
  }
}

export default cloudinary;
