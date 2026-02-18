const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');

router.get('/', authMiddleware, getProjects);
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);   // สำหรับ Rename
router.delete('/:id', authMiddleware, deleteProject); // สำหรับ Delete

module.exports = router;