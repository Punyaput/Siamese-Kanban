import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Password ไม่ตรงกัน!');
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const endpoint = isLogin ? 'login' : 'register';
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/${endpoint}`, formData);

      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/workspace');
      } else {
        alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        setIsLogin(true);
        setFormData({ ...formData, password: '', confirmPassword: '' });
      }

    } catch (error) {
      alert(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundLayer}></div>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</h2>

        <form onSubmit={handleSubmit} style={styles.form}>

          {!isLogin && (
            <>
              <div style={styles.row}>
                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={styles.input} />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
              </div>
            </>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username (ID)</label>
            <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} required style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />
          </div>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={styles.input} />
            </div>
          )}

          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

import workspaceBg from '../assets/workspace-bg.webp';

const styles = {
  container: {
    position: 'relative',
    height: 'calc(100vh - 60px)',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    margin: 0,
    padding: 0
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${workspaceBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(8px) brightness(0.7)', // เพิ่มความมืดให้รูปหลังนิดหน่อย การ์ดจะได้เด่น
    transform: 'scale(1.05)',
    zIndex: 0
  },
  card: {
    backgroundColor: 'rgba(30, 25, 22, 0.65)', // ปรับให้ติดโทนน้ำตาลเข้ม
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(190, 155, 121, 0.3)', // ขอบสีทองจางๆ
    padding: '50px 40px',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    width: '420px',
    maxWidth: '90%',
    color: 'white',
    position: 'relative',
    zIndex: 1
  },
  title: {
    textAlign: 'center',
    marginBottom: '35px',
    fontSize: '32px',
    fontWeight: '800',
    color: '#F6E2B3', // ตัวหนังสือสีทองอ่อน
    letterSpacing: '1px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  row: {
    display: 'flex',
    gap: '15px',
    width: '100%'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    width: '100%'
  },
  label: {
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#d4b497', // สีทองทราย
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  input: {
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid rgba(190, 155, 121, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    transition: '0.3s'
  },
  button: {
    padding: '16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#be9b79', // ปุ่มสีทอง
    color: '#2a2421', // ตัวอักษรสีเข้ม
    cursor: 'pointer',
    marginTop: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: '0.2s',
    boxShadow: '0 4px 15px rgba(190, 155, 121, 0.3)'
  },
  toggleText: {
    marginTop: '25px',
    fontSize: '14px',
    textAlign: 'center',
    color: '#a9a9a9'
  },
  link: {
    textDecoration: 'none',
    cursor: 'pointer',
    color: '#F6E2B3',
    fontWeight: 'bold',
    marginLeft: '5px'
  }
};