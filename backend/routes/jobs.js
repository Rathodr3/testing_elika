
const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { permissionsMiddleware } = require('../middleware/permissions');
const { auditMiddleware } = require('../middleware/auditMiddleware');
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

// Protected routes (require authentication and permissions)
router.get('/', 
  authMiddleware, 
  permissionsMiddleware('jobs', 'read'),
  auditMiddleware('view', 'jobs'),
  getAllJobs
);

router.post('/', 
  authMiddleware, 
  permissionsMiddleware('jobs', 'create'),
  auditMiddleware('create', 'jobs'),
  createJob
);

router.put('/:id', 
  authMiddleware, 
  permissionsMiddleware('jobs', 'update'),
  auditMiddleware('update', 'jobs'),
  updateJob
);

router.delete('/:id', 
  authMiddleware, 
  permissionsMiddleware('jobs', 'delete'),
  auditMiddleware('delete', 'jobs'),
  deleteJob
);

module.exports = router;
