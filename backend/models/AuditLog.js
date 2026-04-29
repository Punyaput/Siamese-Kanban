const mongoose = require('mongoose');

// [CR-00008] Activity History model (FR-U4.2)
const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    taskTitle: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    performedBy: { type: String, default: 'Unknown' }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);