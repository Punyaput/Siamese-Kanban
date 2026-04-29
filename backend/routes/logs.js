const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const AuditLog = require('../models/AuditLog');

// [CR-00008] GET /api/logs/:projectId (FR-U4.2)
router.get('/:projectId', authMiddleware, async (req, res) => {
    try {
        const logs = await AuditLog.find({ projectId: req.params.projectId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;