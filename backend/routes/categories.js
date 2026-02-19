const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getCategories, createCategory, deleteCategory, reorderCategories, moveCategory } = require('../controllers/categoryController');

// GET /api/categories/:projectId (ดึงหมวดหมู่ทั้งหมดของบอร์ดนั้น)
router.get('/:projectId', authMiddleware, getCategories);

// POST /api/categories (สร้างหมวดหมู่ใหม่)
router.post('/', authMiddleware, createCategory);

router.delete('/:id', authMiddleware, deleteCategory);

router.put('/reorder', authMiddleware, reorderCategories);

router.put('/move/:id', authMiddleware, moveCategory);

module.exports = router;