import React, { useState } from 'react';

const priorityConfig = {
  High: { color: '#e07070', bg: 'rgba(224,112,112,0.12)', dot: '#e07070' },
  Medium: { color: '#d4a853', bg: 'rgba(212,168,83,0.12)', dot: '#d4a853' },
  Low: { color: '#6aaa7a', bg: 'rgba(106,170,122,0.12)', dot: '#6aaa7a' },
};

export default function TaskCard({ task, onClick }) {
  const [hovered, setHovered] = useState(false);
  const priority = task.priority || 'Medium';
  const cfg = priorityConfig[priority];

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {task.imageUrl && <img src={task.imageUrl} alt="Task" style={styles.image} />}

      <div style={styles.title}>{task.title}</div>

      {task.description && (
        <div style={styles.desc}>{task.description.slice(0, 60)}{task.description.length > 60 ? '…' : ''}</div>
      )}

      <div style={styles.footer}>
        <span style={{ ...styles.priorityBadge, color: cfg.color, backgroundColor: cfg.bg }}>
          <span style={{ ...styles.priorityDot, backgroundColor: cfg.dot }} />
          {priority}
        </span>
        {task.assignedTo && (
          <span style={styles.assignee}>👤 {task.assignedTo}</span>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#2e2118',
    borderRadius: '8px',
    padding: '12px 14px',
    cursor: 'pointer',
    border: '1px solid rgba(190,155,121,0.1)',
    transition: 'all 0.18s ease',
  },
  cardHover: {
    border: '1px solid rgba(190,155,121,0.35)',
    backgroundColor: '#352519',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
  },
  image: { width: '100%', borderRadius: '5px', marginBottom: '8px', objectFit: 'cover', maxHeight: '120px' },
  title: { fontSize: '14px', fontWeight: '600', color: '#F6E2B3', marginBottom: '5px', lineHeight: 1.4, fontFamily: 'Georgia, serif', wordBreak: 'break-word' },
  desc: { fontSize: '12px', color: 'rgba(246,226,179,0.45)', lineHeight: 1.5, marginBottom: '10px', fontStyle: 'italic' },
  footer: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '8px' },
  priorityBadge: {
    display: 'flex', alignItems: 'center', gap: '5px',
    fontSize: '11px', fontWeight: '600', padding: '3px 8px',
    borderRadius: '4px', letterSpacing: '0.3px',
  },
  priorityDot: { width: '5px', height: '5px', borderRadius: '50%' },
  assignee: {
    fontSize: '11px', color: 'rgba(246,226,179,0.5)',
    backgroundColor: 'rgba(190,155,121,0.08)',
    padding: '3px 8px', borderRadius: '4px',
  },
};