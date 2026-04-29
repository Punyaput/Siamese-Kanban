import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import workspaceBg from '../assets/workspace-bg.webp';

export default function Welcome() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.grain} />

      <div style={{ ...styles.content, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={styles.eyebrow}>PROJECT MANAGEMENT REIMAGINED</div>

        <h1 style={styles.title}>Siamese<br />Kanban</h1>

        <div style={styles.divider} />

        <p style={styles.description}>
          Visualize your workflow. Coordinate your team.<br />
          Ship what matters.
        </p>

        <button
          style={styles.button}
          onClick={() => navigate('/auth')}
          onMouseEnter={e => {
            e.target.style.backgroundColor = '#F6E2B3';
            e.target.style.color = '#1a1210';
            e.target.style.letterSpacing = '3px';
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#F6E2B3';
            e.target.style.letterSpacing = '2px';
          }}
        >
          GET STARTED
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: 'calc(100vh - 64px)',
    width: '100%',
    backgroundImage: `url(${workspaceBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(26,18,16,0.92) 0%, rgba(42,36,33,0.85) 50%, rgba(26,18,16,0.92) 100%)',
  },
  grain: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
    opacity: 0.4,
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 24px',
  },
  eyebrow: {
    fontSize: '11px',
    letterSpacing: '4px',
    color: '#be9b79',
    fontFamily: 'Georgia, serif',
    marginBottom: '28px',
    opacity: 0.8,
  },
  title: {
    fontSize: 'clamp(64px, 12vw, 120px)',
    fontFamily: 'Georgia, serif',
    fontWeight: '900',
    lineHeight: 1.0,
    margin: '0 0 28px 0',
    background: 'linear-gradient(180deg, #F6E2B3 0%, #be9b79 60%, #8B6A4A 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-2px',
    filter: 'drop-shadow(0 8px 32px rgba(190,155,121,0.3))',
  },
  divider: {
    width: '60px',
    height: '1px',
    backgroundColor: '#be9b79',
    margin: '0 auto 28px',
    opacity: 0.6,
  },
  description: {
    fontSize: '17px',
    lineHeight: 1.8,
    color: 'rgba(246,226,179,0.7)',
    fontFamily: 'Georgia, serif',
    marginBottom: '52px',
    fontStyle: 'italic',
  },
  button: {
    padding: '16px 52px',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '2px',
    fontFamily: 'Georgia, serif',
    border: '1px solid #F6E2B3',
    backgroundColor: 'transparent',
    color: '#F6E2B3',
    cursor: 'pointer',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
};