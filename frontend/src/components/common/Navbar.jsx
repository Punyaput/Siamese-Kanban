import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const profileImage = user.profileImage || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541';

  // เช็คว่าเป็นหน้า Auth หรือ Welcome (/) หรือไม่?
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/';

  return (
    <div style={styles.navbar}>
      {/* Brand / Logo */}
      <div 
        style={{
          ...styles.brand, 
          cursor: isAuthPage ? 'default' : 'pointer' 
        }} 
        onClick={isAuthPage ? null : () => navigate('/workspace')}
      >
        {/* --- โลโก้เดิมเป๊ะๆ ไม่มีการเปลี่ยนแปลง --- */}
        <img 
          src="https://image2url.com/r2/default/images/1771440606323-09353ab1-b699-4477-a77a-82435c4f938e.png" 
          alt="Siamese Logo" 
          style={styles.logoImage}
        />
        <span>Siamese</span>
      </div>

      {/* แสดงส่วนขวา (Profile) เฉพาะเมื่อ "ไม่ใช่" หน้า Auth */}
      {!isAuthPage && (
        <div style={styles.rightSection}>
          <img 
            src={profileImage} 
            alt="Profile" 
            style={styles.avatar}
            onClick={() => navigate('/profile')}
            title="Go to Profile"
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  navbar: {
    height: '60px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // ขาวแบบโปร่งแสงนิดๆ
    backdropFilter: 'blur(10px)', // เอฟเฟกต์กระจกเบาๆ
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 30px', // เพิ่มพื้นที่ว่างซ้ายขวาให้ดูไม่อึดอัด
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)', // ปรับเงาให้ฟุ้งและดูแพงขึ้น
    borderBottom: '1px solid rgba(190, 155, 121, 0.2)', // ขอบล่างสีทองจางๆ คุมโทน
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  brand: {
    color: '#4D3D2E',
    fontSize: '26px', // ปรับขนาดตัวหนังสือให้บาลานซ์กับ Navbar 60px
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    letterSpacing: '0.5px'
  },
  logoImage: {
    width: '45px', // ลดขนาดรูปลงนิดนึงไม่ให้ชนขอบบนล่าง
    height: '45px',
    objectFit: 'contain',
    marginRight: '12px' // เพิ่มระยะห่างระหว่างโลโก้กับตัวหนังสือ
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    objectFit: 'cover',
    cursor: 'pointer',
    border: '2px solid #be9b79', // ดึงสีทอง/ทรายจาก Theme มาใช้เป็นกรอบรูป
    backgroundColor: '#f5f5f5',
    transition: 'transform 0.2s ease', // เพิ่ม Animation ตอนเอาเมาส์ชี้
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }
};