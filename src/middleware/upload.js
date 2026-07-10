const multer = require('multer');
const path = require('path');

const ALLOWED_EXTENSIONS = new Set([
  '.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.mp3', '.wav', '.ogg', '.m4a',
  '.mp4', '.webm', '.mov',
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTENSIONS.has(ext)) {
    return cb(null, true);
  }
  const allowed = [...ALLOWED_EXTENSIONS].map((e) => e.slice(1)).join(', ');
  cb(new Error(`File type not allowed. Accepted types: ${allowed}`));
};

const inMemoryStorage = multer.memoryStorage();

const upload = multer({
  storage: inMemoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

module.exports = upload;