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
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    backgroundColor: 'rgba(20, 15, 12, 0.6)', // สีพื้นหลังโทนเข้มโปร่งแสง
    backdropFilter: 'blur(5px)', // เพิ่มเอฟเฟกต์เบลอพื้นหลังให้ดู Modern
    WebkitBackdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeInOverlay 0.3s ease-in-out'
  },
  modal: {
    backgroundColor: '#ffffff',
    padding: '30px 35px',
    borderRadius: '16px', // ปรับความโค้งมนให้สอดคล้องกับ Card อื่นๆ
    width: '420px',
    maxWidth: '90%',
    boxShadow: '0 15px 35px rgba(0,0,0,0.25)', // เพิ่มเงาให้กล่องดูลอยขึ้นมา
    animation: 'slideUp 0.3s ease-out'
  },
  header: {
    margin: '0 0 20px 0',
    color: '#2a2421', // ใช้สีน้ำตาลเข้มตาม Theme
    fontSize: '22px',
    fontWeight: '800',
    borderBottom: '2px solid #f0f0f0', // เส้นแบ่งหัวข้อบางๆ
    paddingBottom: '15px'
  },
  body: {
    marginBottom: '25px',
    color: '#333'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px'
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
    color: '#555',
    fontWeight: 'bold',
    fontSize: '15px',
    transition: 'background-color 0.2s'
  },
  confirmBtn: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#be9b79', // เปลี่ยนเป็นสีทองทรายตาม Theme
    color: '#2a2421', // ตัวหนังสือสีเข้มให้ตัดกับปุ่มสีทอง
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '15px',
    boxShadow: '0 4px 12px rgba(190, 155, 121, 0.3)', // เงาสีทองจางๆ
    transition: 'transform 0.1s, boxShadow 0.2s'
  }
};