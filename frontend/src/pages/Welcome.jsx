import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    // container: คือส่วนที่จะขยายเต็มจอและมีรูปพื้นหลัง
    <div style={styles.container}>
      
      {/* content: คือส่วนข้อความตรงกลาง (มีพื้นหลังดำจางๆ เพื่อให้อ่านออก) */}
      <div style={styles.content}>
        
        <h1 style={styles.title}>Siamese</h1>
        
        <p style={styles.description}>
          Manage your projects efficiently with our Kanban board. <br/>
          Simple, fast, and effective workflow for your team.
        </p>

        <button 
          style={styles.button} 
          onClick={() => navigate('/auth')}
        >
          Let's Start
        </button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    // --- ส่วนจัดการ Background เต็มจอ ---
    height: 'calc(100vh - 60px)', // ความสูงเต็มจอ (ลบความสูง Navbar 60px ออก)
    width: '100%',                 // ความกว้างเต็มจอ
    
    // ใส่ URL รูปภาพตรงนี้ครับ (ตอนนี้เป็นรูปตัวอย่างตึกสูง)
    backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
    
    backgroundSize: 'cover',       // ขยายรูปให้เต็มพื้นที่เสมอ
    backgroundPosition: 'center',  // จัดรูปให้อยู่ตรงกลาง
    backgroundRepeat: 'no-repeat', // ไม่ให้รูปซ้ำ
    // --------------------------------

    // จัดให้ Content อยู่กึ่งกลางหน้าจอ
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // กรอบข้อความตรงกลาง
    width: '100%',
    height: '100%',
    textAlign: 'center',
    color: 'white',
    // สีดำจางๆ (Opacity 0.6) เฉพาะหลังข้อความเพื่อให้อ่านง่ายขึ้น
    // backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    // padding: '40px 60px',
    // borderRadius: '15px',
    backdropFilter: 'blur(3px)', // เบลอพื้นหลังนิดๆ ให้ดูสวย
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    maxWidth: '100%', // ไม่ให้กว้างเกินไปบนจอมือถือ
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    marginTop: 0,
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
  },
  description: {
    fontSize: '1.2rem',
    lineHeight: '1.6',
    marginBottom: '0',
    color: '#f0f0f0'
  },
  button: {
    marginTop: '40px', // เว้นระยะห่างด้านบนตามที่ขอ
    padding: '15px 50px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#83684f',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(182, 125, 71, 0.42)',
    transition: 'all 0.3s ease',
  }
};