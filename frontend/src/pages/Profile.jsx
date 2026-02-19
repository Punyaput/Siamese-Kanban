import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [formData, setFormData] = useState({
    user_id: '',
    firstName: '',
    lastName: '',
    email: '',
    profileImage: ''
  });
  
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // 1. เพิ่ม State นี้เพื่อแก้ปัญหาหน้าจอ Blank
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(res.data);
      setNewImageUrl(res.data.profileImage);
    } catch (err) {
      if (err.response?.status === 401) navigate('/auth');
    }
  };

  useEffect(() => {
    if (!token) navigate('/auth');
    else fetchProfile();
  }, [token, navigate]);

  const handleSave = async () => {
    try {
      const res = await axios.put('http://localhost:5000/api/auth/update', 
        { ...formData, profileImage: newImageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('บันทึกข้อมูลเรียบร้อย');
      setFormData(res.data);
      setIsEditingImage(false);
      setIsEditing(false); // ปิดโหมดแก้ไข

      const currentUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...res.data }));
      window.location.reload(); 

    } catch (err) { alert('บันทึกไม่สำเร็จ'); }
  };

  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      localStorage.clear();
      navigate('/auth');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reset ข้อมูลกลับ
  };

  return (
    <div style={styles.container}>

      <div style={styles.contentWrapper}>
        <div style={styles.header}>
           <h2 style={styles.headerTitle}>My Profile</h2>
        </div>
        
        <div style={styles.cardsContainer}>
          {/* Card ซ้าย: รูปโปรไฟล์ */}
          <div style={styles.leftCard}>
            <div style={styles.avatarContainer}>
              <img 
                src={newImageUrl || formData.profileImage} 
                alt="Profile" 
                style={styles.avatar} 
                onError={(e) => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'; }}
              />
            </div>
            
            {isEditingImage ? (
              <div style={{width: '100%', display:'flex', flexDirection:'column', gap:'5px'}}>
                 <input type="text" placeholder="Image URL..." value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} style={styles.input} />
                 <div style={{display:'flex', gap:'5px', justifyContent:'center'}}>
                   <button onClick={handleSave} style={styles.saveBtn}>Save</button>
                   <button onClick={() => { setIsEditingImage(false); setNewImageUrl(formData.profileImage); }} style={styles.cancelBtn}>Cancel</button>
                 </div>
              </div>
            ) : (
              <button onClick={() => setIsEditingImage(true)} style={styles.editImageBtn}>Change Picture</button>
            )}
          </div>

          {/* Card ขวา: ข้อมูลส่วนตัว */}
          <div style={styles.rightCard}>
            
            {/* Header: แสดงปุ่ม Edit มุมขวาบน */}
            <div style={styles.cardHeader}>
              <h3 style={{margin: 0, color: '#666'}}>Personal Information</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} style={styles.editModeBtn}>
                  edit
                </button>
              )}
            </div>

            {/* Form */}
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name</label>
                <input 
                  style={isEditing ? styles.input : styles.inputView} 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                  readOnly={!isEditing}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name</label>
                <input 
                  style={isEditing ? styles.input : styles.inputView} 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>User ID</label>
              <input style={{...styles.inputView, backgroundColor: '#f9f9f9', color: '#999'}} value={formData.user_id} readOnly />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input 
                style={isEditing ? styles.input : styles.inputView} 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                readOnly={!isEditing}
              />
            </div>

            {/* Footer Actions: ปุ่ม Logout หรือ Save อยู่ขวาล่าง */}
            <div style={styles.actionRow}>
               {!isEditing ? (
                 <button onClick={handleLogout} style={styles.logoutBtnLarge}>Logout</button>
               ) : (
                 <>
                   <button onClick={handleCancel} style={styles.cancelBtnLarge}>Cancel</button>
                   <button onClick={handleSave} style={styles.saveBtnLarge}>Save Changes</button>
                 </>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#3a3a3a', fontFamily: 'Arial, sans-serif' },
  contentWrapper: { padding: '40px', width: '100%', boxSizing: 'border-box' },
  header: { marginBottom: '20px' },
  
  cardsContainer: { 
    display: 'flex', 
    gap: '30px', 
    alignItems: 'flex-start', 
    flexWrap: 'wrap', 
    width: '100%' 
  },
  headerTitle: { color: 'white', marginBottom: '30px' },
  leftCard: { 
    backgroundColor: 'white', 
    borderRadius: '15px', 
    padding: '40px', 
    width: '350px', 
    flexShrink: 0, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
  },
  
  rightCard: { 
    backgroundColor: 'white', 
    borderRadius: '15px', 
    padding: '40px', 
    flex: 1, 
    minWidth: '400px', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)' 
  },

  // Header ภายใน Card ขวา
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    width: '100%'
  },

  editModeBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'underline'
  },

  avatarContainer: { width: '200px', height: '200px', borderRadius: '50%', overflow: 'hidden', marginBottom: '20px', border: '5px solid #ccc' },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  
  row: { display: 'flex', gap: '20px', marginBottom: '15px' },
  formGroup: { flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '15px' },
  label: { fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' },
  
  // Input Styles
  input: { 
    padding: '10px', 
    borderRadius: '5px', 
    border: '1px solid #ccc', 
    fontSize: '16px', 
    width: '100%',
    backgroundColor: '#fff' 
  },
  inputView: { 
    padding: '10px', 
    borderRadius: '5px', 
    border: '1px solid transparent', 
    fontSize: '16px', 
    width: '100%',
    backgroundColor: 'transparent',
    fontWeight: '500',
    color: '#333',
    outline: 'none'
  },

  // Buttons
  editImageBtn: { padding: '8px 16px', backgroundColor: '#ddd', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  saveBtn: { padding: '5px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  cancelBtn: { padding: '5px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  
  // Action Row (Right Aligned)
  actionRow: { 
    display: 'flex', 
    justifyContent: 'flex-end', 
    gap: '10px',
    marginTop: 'auto', 
    paddingTop: '20px' 
  },
  
  saveBtnLarge: { padding: '12px 24px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  cancelBtnLarge: { padding: '12px 24px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' },
  logoutBtnLarge: { padding: '12px 24px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};