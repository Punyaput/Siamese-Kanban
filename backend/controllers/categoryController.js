const Category = require('../models/Category');
const Task = require('../models/Task');

// ดึง Category ทั้งหมดของ Project นั้นๆ
exports.getCategories = async (req, res) => {
  try {
    const { projectId } = req.params;
    // ต้องมี .sort({ order: 1 }) เพื่อเรียงจากน้อยไปมาก
    const categories = await Category.find({ projectId }).sort({ order: 1 }); 
    res.json(categories);
  } catch (err) { res.status(500).json({ message: 'Server Error' }); }
};

// สร้าง Category ใหม่
exports.createCategory = async (req, res) => {
  try {
    const { name, projectId } = req.body;
    
    // หา order ตัวสุดท้ายเพื่อจะเอามา +1 (ให้มันไปต่อท้ายสุด)
    const lastCategory = await Category.findOne({ projectId }).sort({ order: -1 }); 
    const newOrder = lastCategory ? lastCategory.order + 1 : 0;

    const newCategory = new Category({
      name,
      projectId, // บันทึกเป็น projectId
      order: newOrder
    });

    await newCategory.save();
    res.json(newCategory);
  } catch (err) { res.status(500).json({ message: 'Server Error' }); }
};

exports.reorderCategories = async (req, res) => {
  try {
    const { newOrderIds } = req.body; // รับ ID ที่เรียงแล้ว เช่น ['id_ของเสา2', 'id_ของเสา1', 'id_ของเสา3']

    // วนลูปอัปเดต order ของแต่ละเสาตามลำดับใน Array
    const updatePromises = newOrderIds.map((id, index) => {
      return Category.findByIdAndUpdate(id, { order: index });
    });

    // รอจนกว่าจะอัปเดตครบทุกตัว
    await Promise.all(updatePromises);

    res.json({ message: 'Reorder successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // 1. ลบ Tasks ทั้งหมดที่อยู่ใน Category นี้ก่อน (Cascade Delete)
    await Task.deleteMany({ categoryId: id });
    // 2. ลบตัว Category เอง
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.moveCategory = async (req, res) => {
  try {
    const { id } = req.params; // ID ของเสาที่ถูกลาก
    const { newOrder } = req.body; // ตำแหน่ง index ใหม่ที่ลากไปวาง

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const projectId = category.projectId;
    const oldOrder = category.order;

    if (oldOrder !== newOrder) {
      if (newOrder > oldOrder) {
        // ลากไปทางขวา: เสาที่อยู่ระหว่างทางต้องขยับมาทางซ้าย (-1)
        await Category.updateMany(
          { projectId, order: { $gt: oldOrder, $lte: newOrder } },
          { $inc: { order: -1 } }
        );
      } else {
        // ลากไปทางซ้าย: เสาที่ขวางทางอยู่ต้องขยับไปทางขวา (+1)
        await Category.updateMany(
          { projectId, order: { $gte: newOrder, $lt: oldOrder } },
          { $inc: { order: 1 } }
        );
      }
      
      // อัปเดตตำแหน่งเสาตัวมันเอง
      category.order = newOrder;
      await category.save();
    }

    res.json({ message: 'Category moved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
// (Optional) เดี๋ยวเราค่อยมาเพิ่ม API ย้าย/ลบ ทีหลังครับ