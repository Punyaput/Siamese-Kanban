const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  ownerId: { 
    type: String, 
    required: true 
  },
  // เพิ่ม field อื่นๆ ได้ในอนาคต เช่น description, members
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);