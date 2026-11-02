import multer from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

export const documentUploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per document
    files: 5, // max 5 files per request
  },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const isMimeValid = ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase());
    const isExtValid = ALLOWED_EXTENSIONS.some((ext) =>
      file.originalname.toLowerCase().endsWith(ext)
    );

    if (isMimeValid || isExtValid) {
      cb(null, true);
    } else {
      cb(new Error('Invalid document format. Only JPG, JPEG, PNG, WEBP, and PDF files are permitted.'));
    }
  },
});
