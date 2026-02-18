const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    default: 'New Category'
  },
  dashboardId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Dashboard', // ระบุว่า Category นี้อยู่บนบอร์ดไหน
    required: true 
  },
  order: { // สำหรับจัดเรียงลำดับ Category ซ้ายไปขวา
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);