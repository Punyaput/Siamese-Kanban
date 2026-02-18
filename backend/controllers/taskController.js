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

exports.moveTask = async (req, res) => {
  try {
    const { id } = req.params; // ID ของ Task ที่ถูกลาก
    const { categoryId, newOrder } = req.body; // ปลายทาง

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const oldCategoryId = task.categoryId.toString();
    const oldOrder = task.order;

    // === กรณีที่ 1: ย้ายภายในเสาเดิม (Reorder) ===
    if (oldCategoryId === categoryId) {
      if (oldOrder !== newOrder) {
        if (newOrder > oldOrder) {
          // ลากลง: ให้ตัวที่อยู่ระหว่างทาง ขยับขึ้น (-1)
          await Task.updateMany(
            { categoryId, order: { $gt: oldOrder, $lte: newOrder } },
            { $inc: { order: -1 } }
          );
        } else {
          // ลากขึ้น: ให้ตัวที่อยู่ระหว่างทาง ขยับลง (+1)
          await Task.updateMany(
            { categoryId, order: { $gte: newOrder, $lt: oldOrder } },
            { $inc: { order: 1 } }
          );
        }
        // อัปเดตตัวมันเอง
        task.order = newOrder;
        await task.save();
      }
    } 
    // === กรณีที่ 2: ย้ายข้ามเสา (Move Column) ===
    else {
      // 1. จัดการเสาเก่า: ใครที่อยู่ต่อจากมัน ให้ขยับขึ้นมาแทนที่ (-1)
      await Task.updateMany(
        { categoryId: oldCategoryId, order: { $gt: oldOrder } },
        { $inc: { order: -1 } }
      );

      // 2. จัดการเสาใหม่: ใครที่ขวางทางอยู่ ให้ขยับหลบไปข้างล่าง (+1)
      await Task.updateMany(
        { categoryId: categoryId, order: { $gte: newOrder } },
        { $inc: { order: 1 } }
      );

      // 3. ย้ายตัวมันเองไปบ้านใหม่
      task.categoryId = categoryId;
      task.order = newOrder;
      await task.save();
    }

    res.json({ message: 'Task moved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};