import React from 'react';

const priorityColors = {
  High: { bg: '#ffe0e0', text: '#c0392b' },
  Medium: { bg: '#fff4e0', text: '#e67e22' },
  Low: { bg: '#e0f0e0', text: '#27ae60' }
};

export default function TaskCard({ task, onClick }) {
  const priority = task.priority || 'Medium';
  const colors = priorityColors[priority];

  return (
    <div style={styles.card} onClick={onClick}>
      {task.imageUrl && <img src={task.imageUrl} alt="Task" style={styles.image} />}
      <div style={styles.content}>{task.title}</div>
      <div style={styles.footer}>
        <span style={{ ...styles.badge, backgroundColor: colors.bg, color: colors.text }}>
          {priority}
        </span>
        {task.assignedTo && (
          <span style={{ fontSize: '11px', color: '#666', backgroundColor: '#f0f0f0', padding: '2px 8px', borderRadius: '10px' }}>
            👤 {task.assignedTo}
          </span>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#fff', borderRadius: '8px', padding: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', cursor: 'pointer' },
  image: { width: '100%', borderRadius: '4px', marginBottom: '5px' },
  content: { fontSize: '14px', color: '#333', wordWrap: 'break-word', marginBottom: '8px' },
  footer: { display: 'flex', gap: '6px' },
  badge: { fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }
};