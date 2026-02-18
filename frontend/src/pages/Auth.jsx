import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  
  // เพิ่ม State สำหรับเก็บข้อมูลฟอร์มใหม่
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
    confirmPassword: '', // เพิ่ม
    firstName: '',       // เพิ่ม
    lastName: '',        // เพิ่ม
    email: ''            // เพิ่ม
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Logic ตรวจสอบก่อนส่ง (Validation)
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        alert('Password และ Confirm Password ไม่ตรงกัน!');
        return;
      }
    }
    
    const endpoint = isLogin ? 'login' : 'register'; 
    
    try {
      // ส่งข้อมูลไป Backend (Axios จะฉลาดพอที่จะส่งเฉพาะ field ที่ backend ต้องการ ถ้าเราส่งเกินไปมันก็ไม่พังครับ)
      const response = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, formData);

      if (isLogin) {
        alert('เข้าสู่ระบบสำเร็จ!');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/workspace');
      } else {
        alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        setIsLogin(true);
        // เคลียร์ฟอร์ม
        setFormData({ ...formData, password: '', confirmPassword: '' });
      }

    } catch (error) {
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* --- ส่วนที่แสดงเฉพาะตอน Register --- */}
          {!isLogin && (
            <>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label>First Name:</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label>Last Name:</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={styles.input} />
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
              </div>
            </>
          )}

          {/* --- ส่วนที่แสดงตลอด (Login & Register) --- */}
          <div style={styles.inputGroup}>
            <label>Username (ID):</label>
            <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} required style={styles.input} />
          </div>
          
          <div style={styles.inputGroup}>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />
          </div>

          {/* --- Confirm Password แสดงเฉพาะตอน Register --- */}
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label>Confirm Password:</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={styles.input} />
            </div>
          )}

          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? "don't have account yet? " : "already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            {isLogin ? 'register' : 'login'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#9a9a9a' },
  card: { backgroundColor: '#4a4a4a', padding: '40px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', width: '400px', textAlign: 'center', color: 'white' },
  title: { marginBottom: '20px', fontSize: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
  row: { display: 'flex', gap: '10px' }, // จัด Firstname/Lastname ให้อยู่แถวเดียวกัน
  input: { padding: '10px', borderRadius: '5px', border: 'none', marginTop: '5px' },
  button: { padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#888', color: 'white', cursor: 'pointer', marginTop: '10px', fontSize: '16px' },
  toggleText: { marginTop: '20px', fontSize: '14px' },
  link: { textDecoration: 'underline', cursor: 'pointer', color: '#ddd' }
};