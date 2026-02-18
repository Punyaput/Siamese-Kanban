const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getTasks, createTask, updateTask, deleteTask, moveTask } = require('../controllers/taskController');

// บังคับผ่าน Auth ทุกเส้น
router.use(authMiddleware);

// GET /api/tasks/:categoryId (ดึงการ์ดทั้งหมดของเลนนั้น)
router.get('/:categoryId', getTasks);

// POST /api/tasks (สร้างการ์ดใหม่)
router.post('/', createTask);

// PUT /api/tasks/:id (แก้ไข หรือ ย้ายการ์ด)
router.put('/:id', updateTask);

// DELETE /api/tasks/:id (ลบการ์ด)
router.delete('/:id', deleteTask);

router.put('/move/:id', authMiddleware, moveTask);

module.exports = router;