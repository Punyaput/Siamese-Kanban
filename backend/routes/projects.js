const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getProjects, createProject, updateProject, deleteProject, getProjectById, inviteMember } = require('../controllers/projectController');

router.get('/', authMiddleware, getProjects);
router.post('/', authMiddleware, createProject);
router.get('/:id', authMiddleware, getProjectById);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);
router.post('/:id/invite', authMiddleware, inviteMember); // [CR-00010]

module.exports = router;