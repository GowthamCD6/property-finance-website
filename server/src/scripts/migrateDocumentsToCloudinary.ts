import dotenv from 'dotenv';
dotenv.config();

import prisma from '../database/client';
import { isCloudinaryConfigured, uploadBase64ToCloudinary } from '../config/cloudinary';

/**
 * Migration Script: Safely migrate legacy Base64 documents embedded in additionalNotes
 * to Cloudinary storage and separate EnquiryDocument table.
 *
 * Usage:
 *   npx tsx src/scripts/migrateDocumentsToCloudinary.ts
 */
async function runMigration() {
  console.log('========================================================================');
  console.log('🚀 Starting Cloudinary Document Migration for Prime Associates');
  console.log('========================================================================\n');

  if (!isCloudinaryConfigured()) {
    console.error('❌ Cloudinary credentials are not configured in server/.env.');
    console.error('   Please provide:');
    console.error('     CLOUDINARY_CLOUD_NAME=<your_cloud_name>');
    console.error('     CLOUDINARY_API_KEY=<your_api_key>');
    console.error('     CLOUDINARY_API_SECRET=<your_api_secret>');
    console.error('   Then rerun this script.\n');
    process.exit(1);
  }

  // 1. Identify enquiries with legacy documents embedded
  const enquiriesWithDocs = await prisma.enquiry.findMany({
    where: {
      additionalNotes: {
        contains: '<!--DOCUMENTS_JSON:',
      },
    },
    select: {
      id: true,
      referenceNumber: true,
      fullName: true,
      additionalNotes: true,
    },
  });

  console.log(`Found ${enquiriesWithDocs.length} enquiry record(s) containing legacy embedded documents.\n`);

  if (enquiriesWithDocs.length === 0) {
    console.log('✅ Zero legacy Base64 documents found. Nothing to migrate.');
    process.exit(0);
  }

  let totalMigrated = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const enq of enquiriesWithDocs) {
    console.log(`\n📋 Processing Enquiry [${enq.referenceNumber}] (${enq.fullName})...`);

    const notes = enq.additionalNotes || '';
    const match = notes.match(/<!--DOCUMENTS_JSON:(.*?)-->/s);
    if (!match || !match[1]) {
      console.log(`   ⚠️ Could not extract DOCUMENTS_JSON block from enquiry ${enq.referenceNumber}. Skipping.`);
      continue;
    }

    let parsedDocs: any[] = [];
    try {
      parsedDocs = JSON.parse(match[1]);
    } catch (parseErr) {
      console.error(`   ❌ Failed to parse JSON block in enquiry ${enq.referenceNumber}:`, parseErr);
      totalFailed++;
      continue;
    }

    if (!Array.isArray(parsedDocs) || parsedDocs.length === 0) {
      console.log(`   ℹ️ Empty documents array for enquiry ${enq.referenceNumber}. Cleaning note block.`);
      const cleaned = notes.replace(/<!--DOCUMENTS_JSON:.*?-->/s, '').trim();
      await prisma.enquiry.update({
        where: { id: enq.id },
        data: { additionalNotes: cleaned || null },
      });
      continue;
    }

    let enquiryAllSucceeded = true;
    let enquiryMigratedCount = 0;

    for (const doc of parsedDocs) {
      const docName = doc.documentName || doc.name || 'Document';
      const category = doc.category || 'KYC';
      const base64Data = doc.previewUrl;

      // Idempotency: check if document already exists in EnquiryDocument table
      const existing = await prisma.enquiryDocument.findFirst({
        where: {
          enquiryId: enq.id,
          documentName: docName,
        },
      });

      if (existing) {
        console.log(`   ⏭️ Document [${docName}] already migrated. Skipping.`);
        totalSkipped++;
        continue;
      }

      if (!base64Data || (!base64Data.startsWith('data:') && !base64Data.startsWith('http'))) {
        console.log(`   ⚠️ Document [${docName}] has no valid Base64 payload. Skipping.`);
        continue;
      }

      try {
        console.log(`   📤 Uploading [${docName}] (${category}) to Cloudinary...`);
        const uploadRes = await uploadBase64ToCloudinary(base64Data, {
          enquiryReference: enq.referenceNumber,
          category,
          documentName: docName,
          originalFilename: doc.name || `${docName}.jpg`,
        });

        await prisma.enquiryDocument.create({
          data: {
            enquiryId: enq.id,
            documentName: docName,
            category,
            cloudinaryPublicId: uploadRes.publicId,
            resourceType: uploadRes.resourceType,
            fileFormat: uploadRes.format,
            fileSize: uploadRes.bytes,
            originalFilename: doc.name || `${docName}.${uploadRes.format}`,
            uploadedBy: 'customer',
          },
        });

        console.log(`   ✅ Saved [${docName}] to EnquiryDocument (Cloudinary ID: ${uploadRes.publicId})`);
        enquiryMigratedCount++;
        totalMigrated++;
      } catch (uploadErr) {
        console.error(`   ❌ Failed to migrate document [${docName}]:`, uploadErr);
        enquiryAllSucceeded = false;
        totalFailed++;
      }
    }

    // Only clean out the legacy embedded block if migration for all docs succeeded
    if (enquiryAllSucceeded) {
      const cleaned = notes.replace(/<!--DOCUMENTS_JSON:.*?-->/s, '').trim();
      await prisma.enquiry.update({
        where: { id: enq.id },
        data: { additionalNotes: cleaned || null },
      });
      console.log(`   🎉 Cleaned legacy DOCUMENTS_JSON block from enquiry ${enq.referenceNumber} notes.`);
    } else {
      console.warn(`   ⚠️ Some documents failed for ${enq.referenceNumber}. Retaining legacy backup in notes.`);
    }
  }

  console.log('\n========================================================================');
  console.log('🏁 Migration Complete Summary');
  console.log('========================================================================');
  console.log(`Total Documents Migrated: ${totalMigrated}`);
  console.log(`Total Documents Skipped (Already existed): ${totalSkipped}`);
  console.log(`Total Failures: ${totalFailed}`);
  console.log('========================================================================\n');
}

runMigration()
  .catch((e) => {
    console.error('Fatal error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
