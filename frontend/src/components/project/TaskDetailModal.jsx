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
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#231a17', padding: '24px', borderRadius: '12px', width: '500px', maxWidth: '90%', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(190,155,121,0.2)' },
  closeBtn: { position: 'absolute', top: '14px', right: '16px', fontSize: '20px', cursor: 'pointer', color: 'rgba(190,155,121,0.5)', lineHeight: 1 },
  imageContainer: { width: '100%', height: '180px', backgroundColor: '#1a1210', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', border: '1px solid rgba(190,155,121,0.15)' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  imagePlaceholder: { color: 'rgba(190,155,121,0.3)', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '13px' },
  formContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  urlInput: { padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(190,155,121,0.2)', fontSize: '12px', color: '#F6E2B3', backgroundColor: '#1a1210', outline: 'none', width: '100%', fontFamily: 'Georgia, serif' },
  titleInput: { padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(190,155,121,0.3)', fontSize: '18px', fontWeight: 'bold', outline: 'none', backgroundColor: '#1a1210', color: '#F6E2B3', width: '100%', fontFamily: 'Georgia, serif' },
  descInput: { padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(190,155,121,0.2)', fontSize: '14px', outline: 'none', resize: 'none', backgroundColor: '#1a1210', fontFamily: 'Georgia, serif', color: '#F6E2B3', width: '100%', minHeight: '100px' },
  fieldRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  label: { fontSize: '12px', fontWeight: '600', color: 'rgba(190,155,121,0.7)', minWidth: '80px', letterSpacing: '0.5px', fontFamily: 'Georgia, serif' },
  select: { padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(190,155,121,0.2)', fontSize: '14px', backgroundColor: '#1a1210', color: '#F6E2B3', cursor: 'pointer', outline: 'none', fontFamily: 'Georgia, serif' },
  assignInput: { flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(190,155,121,0.2)', fontSize: '14px', backgroundColor: '#1a1210', color: '#F6E2B3', outline: 'none', fontFamily: 'Georgia, serif' },
  footer: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '14px' },
  cancelBtn: { padding: '9px 28px', borderRadius: '6px', border: '1px solid rgba(190,155,121,0.2)', backgroundColor: 'transparent', color: 'rgba(246,226,179,0.6)', cursor: 'pointer', fontSize: '14px', fontFamily: 'Georgia, serif' },
  applyBtn: { padding: '9px 28px', borderRadius: '6px', border: 'none', backgroundColor: '#be9b79', color: '#1a1210', cursor: 'pointer', fontSize: '14px', fontWeight: '700', fontFamily: 'Georgia, serif' },
  viewContainer: { padding: '4px', display: 'flex', flexDirection: 'column', gap: '12px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  viewTitle: { margin: 0, fontSize: '22px', fontWeight: '700', color: '#F6E2B3', fontFamily: 'Georgia, serif', lineHeight: 1.3 },
  editLink: { color: '#be9b79', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', fontFamily: 'Georgia, serif', flexShrink: 0, marginLeft: '12px' },
  metaRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  priorityBadge: { fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '4px' },
  assigneeBadge: { fontSize: '12px', color: 'rgba(246,226,179,0.6)', backgroundColor: 'rgba(190,155,121,0.1)', padding: '3px 10px', borderRadius: '4px', border: '1px solid rgba(190,155,121,0.2)' },
  viewDesc: { whiteSpace: 'pre-wrap', color: 'rgba(246,226,179,0.7)', lineHeight: '1.6', fontSize: '14px', minHeight: '50px', fontFamily: 'Georgia, serif' },
  deleteContainer: { marginTop: '16px', borderTop: '1px solid rgba(190,155,121,0.1)', paddingTop: '14px', display: 'flex', justifyContent: 'flex-end' },
  deleteBtn: { backgroundColor: 'transparent', color: '#e07070', border: '1px solid rgba(224,112,112,0.3)', borderRadius: '5px', padding: '7px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', fontFamily: 'Georgia, serif' }
};