const Task = require('../models/Task');

// 1. ดึง Task ทั้งหมดใน Category หนึ่งๆ
exports.getTasks = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const tasks = await Task.find({ categoryId }).sort({ order: 1 }); // เรียงตามลำดับบนลงล่าง
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 2. สร้าง Task ใหม่
exports.createTask = async (req, res) => {
  try {
    // รับ title แทน content
    const { title, categoryId } = req.body; 

    const lastTask = await Task.findOne({ categoryId }).sort({ order: -1 });
    const newOrder = lastTask ? lastTask.order + 1 : 0;

    const newTask = new Task({
      title, // ใช้ title แล้ว
      categoryId,
      order: newOrder,
      description: '' // เริ่มต้นเป็นว่างๆ
    });

    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 3. แก้ไข Task (ใช้สำหรับแก้ข้อความ หรือ ย้ายการ์ดข้ามเลน)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    // รับค่าทั้งหมดที่อาจจะถูกแก้
    const { title, description, imageUrl, categoryId, order } = req.body;

    let updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description; // เพิ่มบรรทัดนี้
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (order !== undefined) updateData.order = order;

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 4. ลบ Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};