import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    // container: คือส่วนที่จะขยายเต็มจอและมีรูปพื้นหลัง
    <div style={styles.container}>
      
      {/* content: คือส่วนข้อความตรงกลาง (มีพื้นหลังดำจางๆ เพื่อให้อ่านออก) */}
      <div style={styles.content}>
        
        <h1 style={styles.title}>Siamese Kanban</h1>
        
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
    backgroundImage: "url('https://i.ibb.co/1YXwPr5m/Warm-Tone-Working-Space.png')",
    
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
    backdropFilter: 'blur(5px)', // เบลอพื้นหลังนิดๆ ให้ดูสวย
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    maxWidth: '100%', // ไม่ให้กว้างเกินไปบนจอมือถือ
  },
  title: {
    fontSize: '5.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    marginTop: 0,
    backgroundImage: 'linear-gradient(to bottom, #be9b79 20%, #d4b497 50%, #F6E2B3 80%)',
    WebkitBackgroundClip: 'text',
    
    // 1. แก้เป็น transparent
    WebkitTextFillColor: 'transparent', 
    
    display: 'inline-block',
    
    // 2. ลบ textShadow ออก แล้วใช้ filter แทน เพื่อให้เงาอยู่ "ข้างหลัง" ตัวหนังสือจริงๆ
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.6))' 
},
  description: {
    fontSize: '1.6rem',
    fontWeight: '500',
    lineHeight: '1.6',
    marginBottom: '0',
    marginTop: '40px',
    color: '#030303'
  },
  button: {
    marginTop: '100px', // เว้นระยะห่างด้านบนตามที่ขอ
    padding: '15px 100px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#4D3D2E',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 10px 15px rgba(44, 35, 26, 0.7)',
    transition: 'all 0.3s ease',
  }
};