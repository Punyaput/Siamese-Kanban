const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  // --- เพิ่มฟิลด์ใหม่ ---
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true // ห้ามใช้อีเมลซ้ำ
  }
}, { timestamps: true }); // timestamps จะช่วยสร้างฟิลด์ createdAt และ updatedAt ให้อัตโนมัติ

module.exports = mongoose.model('User', userSchema);