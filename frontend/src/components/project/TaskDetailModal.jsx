import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TaskDetailModal({ task, isOpen, onClose, onUpdate, onDelete }) {
  if (!isOpen || !task) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title || '',
    description: task.description || '',
    imageUrl: task.imageUrl || '',
    priority: task.priority || 'Medium',
    assignedTo: task.assignedTo || '',
  });

  useEffect(() => {
    setFormData({
      title: task.title || '',
      description: task.description || '',
      imageUrl: task.imageUrl || '',
      priority: task.priority || 'Medium',
      assignedTo: task.assignedTo || '',
    });
    setIsEditing(false);
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      // ส่ง title, description, imageUrl ไปอัปเดตที่ Backend
      await axios.put(`${API_BASE_URL}/api/tasks/${task._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate();
      setIsEditing(false);
    } catch (err) {
      alert('บันทึกไม่สำเร็จ');
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm('คุณต้องการลบงานนี้ใช่หรือไม่? (Delete Task)')) {
      onDelete(task._id); // เรียกใช้ฟังก์ชันที่ส่งมาจากแม่
      onClose(); // ปิด Modal ทันที
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.closeBtn} onClick={onClose}>✕</div>

        <div style={styles.imageContainer}>
          {formData.imageUrl ? (
            <img src={formData.imageUrl} alt="Task" style={styles.image} />
          ) : (
            <div style={styles.imagePlaceholder}>
              {isEditing ? 'No Image (Paste URL below)' : '< No Image >'}
            </div>
          )}
        </div>

        {isEditing ? (
          // === MODE EDIT ===
          <div style={styles.formContainer}>
            <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Paste Image URL here..." style={styles.urlInput} />
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Task Name" style={styles.titleInput} />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Add more details..." rows={6} style={styles.descInput} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', minWidth: '80px' }}>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}
                style={{ padding: '6px 10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: '#fff' }}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555', minWidth: '80px' }}>Assigned To</label>
              <input name="assignedTo" value={formData.assignedTo} onChange={handleChange}
                placeholder="Enter name..."
                style={{ flex: 1, padding: '6px 10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: '#fff' }} />
            </div>

            <div style={styles.footer}>
              <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSave} style={styles.applyBtn}>Apply</button>
            </div>
          </div>
        ) : (
          // === MODE VIEW ===
          <div style={styles.viewContainer}>
            <div style={styles.headerRow}>
              <h2 style={styles.viewTitle}>{formData.title}</h2>

              <span style={{
                fontSize: '12px', fontWeight: 'bold', padding: '3px 10px', borderRadius: '10px',
                backgroundColor: priorityColors[formData.priority]?.bg, color: priorityColors[formData.priority]?.text
              }}>
                ⚑ {formData.priority} Priority
              </span>

              {formData.assignedTo && (
                <span style={{ fontSize: '12px', color: '#666', backgroundColor: '#f0f0f0', padding: '3px 10px', borderRadius: '10px' }}>
                  👤 {formData.assignedTo}
                </span>
              )}

              <span style={styles.editLink} onClick={() => setIsEditing(true)}>edit</span>
            </div>
            <div style={styles.viewDesc}>
              {formData.description || <span style={{ color: '#aaa', fontStyle: 'italic' }}>No description provided.</span>}
            </div>

            {/* 3. เพิ่มปุ่มลบ (Delete) ไว้ด้านล่างสุด */}
            <div style={styles.deleteContainer}>
              <button onClick={handleDeleteClick} style={styles.deleteBtn}>
                🗑️ Delete Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  // ... (styles เดิมทั้งหมด) ...
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#e0e0e0', padding: '20px', borderRadius: '15px', width: '500px', maxWidth: '90%', position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' },
  closeBtn: { position: 'absolute', top: '10px', right: '15px', fontSize: '24px', cursor: 'pointer', color: '#999' },
  imageContainer: { width: '100%', height: '200px', backgroundColor: '#fff', borderRadius: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', border: '1px solid #ccc' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  imagePlaceholder: { color: '#bbb' },

  // Edit Mode Styles
  formContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  urlInput: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '12px', color: '#333', width: '100%', marginBottom: '10px' },
  titleInput: { padding: '10px', borderRadius: '5px', border: '1px solid #333', fontSize: '18px', fontWeight: 'bold', outline: 'none', backgroundColor: '#fff', color: '#333', width: '100%' },
  descInput: { padding: '10px', borderRadius: '5px', border: '1px solid #333', fontSize: '14px', outline: 'none', resize: 'none', backgroundColor: '#fff', fontFamily: 'inherit', color: '#333', width: '100%', minHeight: '100px' },
  footer: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' },
  cancelBtn: { padding: '10px 30px', borderRadius: '8px', border: 'none', backgroundColor: '#aaa', color: 'white', cursor: 'pointer', fontSize: '16px' },
  applyBtn: { padding: '10px 30px', borderRadius: '8px', border: 'none', backgroundColor: '#666', color: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },

  // View Mode Styles
  viewContainer: { padding: '5px', display: 'flex', flexDirection: 'column', gap: '10px' }, // เพิ่ม flex
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  viewTitle: { margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'bold', color: '#333' },
  editLink: { color: '#666', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' },
  viewDesc: { whiteSpace: 'pre-wrap', color: '#333', lineHeight: '1.5', fontSize: '14px', minHeight: '50px' },

  // --- 4. Styles สำหรับปุ่มลบ ---
  deleteContainer: {
    marginTop: '20px',
    borderTop: '1px solid #ccc',
    paddingTop: '15px',
    display: 'flex',
    justifyContent: 'flex-end' // จัดชิดขวา
  },
  deleteBtn: {
    backgroundColor: '#ff4d4d', // สีแดง
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 15px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  }
};