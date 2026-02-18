const express = require('express');
const router = express.Router();
const { register, login, getMe, updateUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// กำหนดเส้นทาง: POST /api/auth/register
router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);      // ดึงข้อมูลตัวเอง
router.put('/update', authMiddleware, updateUser); // อัปเดตข้อมูล

module.exports = router;