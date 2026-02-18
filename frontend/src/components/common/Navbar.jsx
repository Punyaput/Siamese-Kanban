import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  // เช็คว่าอยู่หน้า Welcome (/) หรือ Auth (/auth) หรือเปล่า
  // ถ้าไม่ใช่ แปลว่า Login แล้ว ให้แสดงช่อง Search
  const isLoginPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/auth';
  const showSearch = !isLoginPage && !isAuthPage;

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#e0e0e0' }}>
      <div>
        {/* โลโก้ กดแล้วกลับไป Workspace */}
        <Link to="/workspace" style={{ textDecoration: 'none', color: '#ff8a8a', fontWeight: 'bold', fontSize: '1.2rem' }}>
          ⬤ Siamese
        </Link>
      </div>

      {showSearch && (
        <div>
          <input type="text" placeholder="Search dashboard..." style={{ width: '300px', padding: '5px' }} />
        </div>
      )}

      <div>
        {/* Placeholder สำหรับรูปโปรไฟล์ */}
        👤
      </div>
    </nav>
  );
}