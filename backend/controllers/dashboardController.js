const Dashboard = require('../models/Dashboard');

// ฟังก์ชันดึงรายชื่อ Dashboard ทั้งหมดของ User คนนั้น
exports.getDashboards = async (req, res) => {
  try {
    // ค้นหา Dashboard ที่ ownerId ตรงกับ id ของคนที่ล็อกอินเข้ามา
    const dashboards = await Dashboard.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json(dashboards);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ฟังก์ชันสร้าง Dashboard ใหม่
exports.createDashboard = async (req, res) => {
  try {
    const { name } = req.body;

    const newDashboard = new Dashboard({
      name: name || 'New Dashboard', // ถ้าไม่ตั้งชื่อ จะใช้ชื่อ Default
      ownerId: req.user.id // เอา ID มาจาก Middleware ที่เราแนบไว้
    });

    const dashboard = await newDashboard.save();
    res.json(dashboard);

  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};