import React from 'react';

export default function Modal({ isOpen, onClose, title, onSubmit, children }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* หัวข้อ Modal */}
        <h2 style={styles.header}>{title}</h2>

        {/* ฟอร์มกรอกข้อมูล */}
        <form onSubmit={onSubmit}>
          <div style={styles.body}>
            {children}
          </div>

          {/* ปุ่ม Action */}
          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.confirmBtn}>
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // สีดำโปร่งแสง
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    animation: 'fadeIn 0.2s'
  },
  header: {
    margin: '0 0 20px 0',
    color: '#333'
  },
  body: {
    marginBottom: '20px'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  confirmBtn: {
    padding: '8px 16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#ff8a8a', // สีธีมหลัก
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};