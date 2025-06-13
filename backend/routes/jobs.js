
const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
  getAllPublicJobs,
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} = require('../handlers/jobHandlers');

const router = express.Router();

// Public routes
router.get('/public', getAllPublicJobs);
router.get('/:id', getJobById);

// Protected routes (require authentication)
router.get('/', authMiddleware, adminMiddleware, getAllJobs);
router.post('/', authMiddleware, adminMiddleware, createJob);
router.put('/:id', authMiddleware, adminMiddleware, updateJob);
router.delete('/:id', authMiddleware, adminMiddleware, deleteJob);

module.exports = router;
