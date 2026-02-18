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
    
    const endpoint = isLogin ? 'login' : 'register'; 
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, formData);

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
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* --- ส่วน Register --- */}
          {!isLogin && (
            <>
              <div style={styles.row}>
                {/* เพิ่ม flex: 1 ตรงนี้เพื่อให้แบ่งครึ่งเท่ากัน */}
                <div style={{...styles.inputGroup, flex: 1}}>
                  <label style={styles.label}>First Name:</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={styles.input} />
                </div>
                {/* เพิ่ม flex: 1 ตรงนี้เช่นกัน */}
                <div style={{...styles.inputGroup, flex: 1}}>
                  <label style={styles.label}>Last Name:</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={styles.input} />
                </div>
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />
              </div>
            </>
          )}

          {/* --- ส่วน Login & Register --- */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username (ID):</label>
            <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} required style={styles.input} />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />
          </div>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password:</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={styles.input} />
            </div>
          )}

          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? "don't have an account? " : "already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            {isLogin ? 'register' : 'login'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh', 
    backgroundColor: '#9a9a9a' 
  },
  card: { 
    backgroundColor: '#4a4a4a', 
    padding: '40px', 
    borderRadius: '15px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)', // เพิ่มเงาให้ดูมีมิติ
    width: '400px', 
    maxWidth: '90%', // กันล้นจอโทรศัพท์
    color: 'white' 
  },
  title: { 
    textAlign: 'center', 
    marginBottom: '30px', 
    fontSize: '28px',
    fontWeight: 'bold'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px' 
  },
  row: { 
    display: 'flex', 
    gap: '15px', // ระยะห่างระหว่าง First-Last Name
    width: '100%' 
  },
  inputGroup: { 
    display: 'flex', 
    flexDirection: 'column', 
    textAlign: 'left',
    width: '100%' // ให้ input group เต็มความกว้างของ parent
  },
  label: {
    marginBottom: '5px',
    fontSize: '14px',
    color: '#ddd'
  },
  input: { 
    padding: '12px', 
    borderRadius: '6px', 
    border: 'none', 
    backgroundColor: '#333', // สีพื้นหลัง Input เข้มๆ ตามรูป
    color: 'white', 
    fontSize: '16px',
    width: '100%', // สำคัญ: ให้เต็มพื้นที่
    boxSizing: 'border-box', // สำคัญมาก: ป้องกัน Padding ดันจนล้น
    outline: 'none'
  },
  button: { 
    padding: '12px', 
    borderRadius: '6px', 
    border: 'none', 
    backgroundColor: '#888', // สีปุ่มเทาๆ ตาม Theme
    color: 'white', 
    cursor: 'pointer', 
    marginTop: '10px', 
    fontSize: '16px',
    fontWeight: 'bold',
    transition: '0.2s'
  },
  toggleText: { 
    marginTop: '20px', 
    fontSize: '14px', 
    textAlign: 'center',
    color: '#ccc'
  },
  link: { 
    textDecoration: 'underline', 
    cursor: 'pointer', 
    color: '#fff',
    fontWeight: 'bold'
  }
};