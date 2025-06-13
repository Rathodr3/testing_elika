
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { validateJobApplication } = require('../middleware/validation');
const {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  downloadResume,
  deleteApplication
} = require('../handlers/applicationHandlers');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '');
    cb(null, `resume-${uniqueSuffix}-${sanitizedOriginalName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only documents and images are allowed (jpeg, jpg, png, gif, pdf, doc, docx, txt)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});

// Routes
router.post('/', upload.single('resume'), validateJobApplication, submitApplication);
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.put('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);
router.get('/:id/resume', downloadResume);

module.exports = router;
