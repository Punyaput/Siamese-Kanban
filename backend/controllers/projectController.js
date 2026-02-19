const Project = require('../models/Project');
const Category = require('../models/Category');
const Task = require('../models/Task');

// ดึง Project ทั้งหมดของ User
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// สร้าง Project ใหม่
exports.createProject = async (req, res) => {
  try {
    const { name } = req.body;
    const newProject = new Project({
      name: name || 'New Project',
      ownerId: req.user.id
    });
    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ฟังก์ชันแก้ไขชื่อ Project (Rename)
exports.updateProject = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true } // ให้ส่งค่าใหม่กลับไป
    );
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ฟังก์ชันลบ Project (Cascade Delete)
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    // 1. หา Category ทั้งหมดใน Project นี้
    const categories = await Category.find({ projectId });
    const categoryIds = categories.map(c => c._id);

    // 2. ลบ Task ทั้งหมดที่อยู่ใน Category เหล่านั้น
    await Task.deleteMany({ categoryId: { $in: categoryIds } });

    // 3. ลบ Category ทั้งหมด
    await Category.deleteMany({ projectId });

    // 4. ลบตัว Project เอง
    await Project.findByIdAndDelete(projectId);

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // ส่งข้อมูลโปรเจกต์กลับไป (เราจะเอา field .name ไปใช้)
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};