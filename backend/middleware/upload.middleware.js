import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

// Ensure upload directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename to prevent directory traversal
    const sanitizedName = path.basename(file.originalname).replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(sanitizedName);
    const name = path.basename(sanitizedName, ext);
    cb(null, `${file.fieldname}-${uniqueSuffix}-${name}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Strict MIME type validation
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const allowedExtensions = /\.(jpeg|jpg|png|pdf|doc|docx)$/i;

  // Check both MIME type and extension
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.test(file.originalname)) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, PNG), PDFs, and documents (DOC, DOCX) are allowed'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Maximum 5 files per request
  },
  fileFilter
});
