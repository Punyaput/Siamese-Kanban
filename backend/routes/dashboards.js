const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // เรียกยามมาใช้
const { getDashboards, createDashboard } = require('../controllers/dashboardController');

// บังคับว่าต้องผ่าน authMiddleware ก่อน ถึงจะเรียกใช้ฟังก์ชันได้
router.get('/', authMiddleware, getDashboards);
router.post('/', authMiddleware, createDashboard);

module.exports = router;