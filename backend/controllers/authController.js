// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//   try {
//     const { user_id, password } = req.body;

//     // 1. เช็คว่า user_id นี้มีคนใช้ไปหรือยัง
//     const existingUser = await User.findOne({ user_id });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User ID นี้ถูกใช้งานแล้ว' });
//     }

//     // 2. เข้ารหัส Password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // 3. สร้าง User ใหม่ลง Database
//     const newUser = new User({
//       user_id,
//       password: hashedPassword
//     });

//     await newUser.save();

//     res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ!' });

//   } catch (err) {
//     res.status(500).json({ message: 'Server Error', error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { user_id, password } = req.body;

//     // 1. ค้นหา User จาก Database
//     const user = await User.findOne({ user_id });
//     if (!user) {
//       return res.status(400).json({ message: 'User ID นี้ไม่มีในระบบ' });
//     }

//     // 2. ตรวจสอบรหัสผ่าน (เทียบรหัสที่ส่งมา กับรหัสที่เข้ารหัสไว้ใน DB)
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
//     }

//     // 3. สร้าง Token (บัตรผ่าน) เพื่อยืนยันตัวตน
//     const token = jwt.sign(
//       { id: user._id, user_id: user.user_id },
//       'MY_SECRET_KEY', // ในโปรจริงควรเก็บค่านี้ไว้ใน .env นะครับ
//       { expiresIn: '1d' } // Token มีอายุ 1 วัน
//     );

//     res.json({
//       message: 'เข้าสู่ระบบสำเร็จ!',
//       token,
//       user: { id: user._id, user_id: user.user_id }
//     });

//   } catch (err) {
//     res.status(500).json({ message: 'Server Error', error: err.message });
//   }
// };


const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    // 1. รับค่าทั้งหมดมาจาก Frontend
    const { user_id, password, firstName, lastName, email } = req.body;

    // 2. เช็คว่ามี User ID หรือ Email นี้อยู่แล้วหรือยัง
    const existingUser = await User.findOne({ $or: [{ user_id }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User ID or Email already exists' });
    }

    // 3. เข้ารหัส Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. สร้าง User ใหม่พร้อมข้อมูลครบถ้วน
    const newUser = new User({
      user_id,
      password: hashedPassword,
      firstName,
      lastName,
      email
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.login = async (req, res) => {
  // ... (โค้ด Login เหมือนเดิม ไม่ต้องแก้) ...
  try {
    const { user_id, password } = req.body;
    const user = await User.findOne({ user_id });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id, user_id: user.user_id }, 'MY_SECRET_KEY', { expiresIn: '1h' });

    // ส่งข้อมูล User กลับไปให้ Frontend เก็บไว้ใช้ (เผื่อแสดงชื่อ)
    res.json({ 
      token, 
      user: { 
        user_id: user.user_id, 
        firstName: user.firstName, 
        lastName: user.lastName,
        email: user.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};