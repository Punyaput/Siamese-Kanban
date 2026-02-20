import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Siamese Kanban</h1>
        <p style={styles.description}>
          Manage your projects efficiently with our Kanban board. <br />
          Simple, fast, and effective workflow for your team.
        </p>
        <button
          style={styles.button}
          onClick={() => navigate('/auth')}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Let's Start
        </button>
      </div>
    </div>
  );
}

import workspaceBg from '../assets/workspace-bg.webp';

const styles = {
  container: {
    height: 'calc(100vh - 60px)',
    width: '100%',
    backgroundImage: `url(${workspaceBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
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
    width: '100%',
    height: '100%',
    textAlign: 'center',
    color: 'white',
    backdropFilter: 'blur(3px)',
    backgroundColor: 'rgba(42, 36, 33, 0.4)', // เพิ่ม overlay สีน้ำตาลเข้มจางๆ ให้ตัวหนังสือเด่น
    maxWidth: '100%',
  },
  title: {
    fontSize: '5.5rem',
    fontWeight: '800',
    marginBottom: '10px',
    marginTop: 0,
    backgroundImage: 'linear-gradient(to right, #be9b79 0%, #F6E2B3 50%, #be9b79 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block',
    filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.5))',
    letterSpacing: '2px'
  },
  description: {
    fontSize: '1.4rem',
    fontWeight: '400',
    lineHeight: '1.6',
    marginBottom: '0',
    marginTop: '20px',
    color: '#F0EBE1', // สีครีมอ่อนๆ
    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
  },
  button: {
    marginTop: '60px',
    padding: '16px 60px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderRadius: '50px',
    border: '2px solid #be9b79',
    backgroundColor: '#4D3D2E',
    color: '#F6E2B3',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.3s ease',
    letterSpacing: '1px'
  }
};