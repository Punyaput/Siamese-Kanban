const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. ดึง Token จาก Header (ส่งมาแบบ: "Bearer <token_string>")
  const token = req.header('Authorization');

  // ถ้าไม่มี Token ส่งมา -> ไล่กลับไป
  if (!token) {
    return res.status(401).json({ message: 'ไม่มีสิทธิ์เข้าถึง (No Token)' });
  }

  try {
    // 2. ตัดคำว่า "Bearer " ออก เพื่อเอาแค่ตัวรหัส
    const tokenString = token.split(" ")[1];
    
    // 3. ตรวจสอบความถูกต้องของ Token
    const decoded = jwt.verify(tokenString, 'MY_SECRET_KEY'); // ใช้ Key เดียวกับตอน Login

    // 4. ถ้าผ่าน -> แนบข้อมูล User ลงไปใน request เพื่อให้ Controller เอาไปใช้ต่อได้
    req.user = decoded;
    
    next(); // ปล่อยผ่านไปทำงานต่อ

  } catch (err) {
    res.status(401).json({ message: 'Token ไม่ถูกต้อง หรือหมดอายุ' });
  }
};