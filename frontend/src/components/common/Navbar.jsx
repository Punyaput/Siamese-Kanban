import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import siameseLogo from '../../assets/SiameseLogo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/';
  const initial = (user.firstName || user.user_id || '?')[0].toUpperCase();

  return (
    <nav style={styles.navbar}>
      <div
        style={{ ...styles.brand, cursor: isAuthPage ? 'default' : 'pointer' }}
        onClick={isAuthPage ? null : () => navigate('/workspace')}
      >
        <img src={siameseLogo} alt="Siamese Logo" style={styles.logo} />
        <span style={styles.brandName}>Siamese</span>
      </div>

      {!isAuthPage && (
        <div style={styles.right}>
          <span style={styles.greeting}>
            {user.firstName ? `Hello, ${user.firstName}` : user.user_id}
          </span>
          <div
            style={{
              ...styles.avatar,
              ...(hovered ? styles.avatarHover : {})
            }}
            onClick={() => navigate('/profile')}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            title="Profile"
          >
            {initial}
          </div>
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    height: '64px',
    backgroundColor: '#1a1210',
    borderBottom: '1px solid rgba(190,155,121,0.25)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 36px',
    position: 'sticky',
    top: 0,
    zIndex: 200,
    boxShadow: '0 2px 24px rgba(0,0,0,0.4)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  logo: {
    width: '38px',
    height: '38px',
    objectFit: 'contain',
  },
  brandName: {
    fontSize: '22px',
    fontWeight: '800',
    fontFamily: 'Georgia, serif',
    background: 'linear-gradient(135deg, #be9b79, #F6E2B3, #be9b79)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '1px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  greeting: {
    color: 'rgba(246,226,179,0.6)',
    fontSize: '14px',
    fontFamily: 'Georgia, serif',
    letterSpacing: '0.3px',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#4D3D2E',
    border: '2px solid #be9b79',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#F6E2B3',
    fontWeight: '800',
    fontSize: '16px',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    transition: 'all 0.2s ease',
    boxShadow: '0 0 0 0 rgba(190,155,121,0)',
  },
  avatarHover: {
    backgroundColor: '#be9b79',
    color: '#1a1210',
    boxShadow: '0 0 0 3px rgba(190,155,121,0.3)',
    transform: 'scale(1.08)',
  },
};