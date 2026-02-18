// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: { 
//     type: String, 
//     required: true,
//     default: 'New Task'
//   },
//   description: { 
//     type: String, 
//     default: '' // เก็บรายละเอียดเนื้อหายาวๆ
//   },
//   imageUrl: { 
//     type: String, 
//     default: '' 
//   },
//   categoryId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Category',
//     required: true 
//   },
//   order: { 
//     type: Number,
//     default: 0
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Task', taskSchema);

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, default: 'New Task' }, // ชื่อ Task
  description: { type: String, default: '' }, // รายละเอียดข้างใน
  imageUrl: { type: String, default: '' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);