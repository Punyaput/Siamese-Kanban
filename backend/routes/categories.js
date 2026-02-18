const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getCategories, createCategory, deleteCategory, reorderCategories } = require('../controllers/categoryController');

// GET /api/categories/:dashboardId (ดึงหมวดหมู่ทั้งหมดของบอร์ดนั้น)
router.get('/:dashboardId', authMiddleware, getCategories);

// POST /api/categories (สร้างหมวดหมู่ใหม่)
router.post('/', authMiddleware, createCategory);

router.delete('/:id', authMiddleware, deleteCategory);

router.put('/reorder', authMiddleware, reorderCategories);

module.exports = router;