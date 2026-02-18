const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    default: 'New Dashboard'
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // เชื่อมความสัมพันธ์ไปยัง Collection 'User'
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Dashboard', dashboardSchema);