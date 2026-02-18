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
          // ถ้าเป็นหน้า Auth ให้เมาส์เป็นลูกศรปกติ (กดไม่ได้)
          cursor: isAuthPage ? 'default' : 'pointer' 
        }} 
        onClick={isAuthPage ? null : () => navigate('/workspace')}
      >
        {/* --- เปลี่ยนจากวงกลมสีแดง เป็นรูป Logo --- */}
        <img 
          src="https://image2url.com/r2/default/images/1771440606323-09353ab1-b699-4477-a77a-82435c4f938e.png" 
          alt="Siamese Logo" 
          style={styles.logoImage}
        />
        <span style={{ marginLeft: '4px' }}>Siamese</span>
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
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  navbar: {
    height: '60px',
    backgroundColor: 'white', // 1. พื้นหลังสีขาว
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.36)', // 2. เงาจางๆ ด้านล่าง
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  brand: {
    color: '#4D3D2E', // 4. เปลี่ยนสีตัวอักษรเป็นสีเข้ม (เพราะพื้นขาว)
    fontSize: '30px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center'
  },
  // Style ใหม่สำหรับรูปโลโก้
  logoImage: {
    width: '50px', 
    height: '50px',
    objectFit: 'contain'
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    cursor: 'pointer',
    border: '3px solid #4D3D2E', // ปรับขอบให้เป็นสีเทาอ่อนๆ แทนสีขาว
    backgroundColor: '#eee'
  }
};