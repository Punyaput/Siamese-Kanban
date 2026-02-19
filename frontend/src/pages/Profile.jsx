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
      setIsEditing(false); 

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
    fetchProfile(); 
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
           <h2 style={styles.headerTitle}>My Profile</h2>
        </div>
        
        <div style={styles.cardsContainer}>
          {/* Card ซ้าย */}
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
              <div style={{width: '100%', display:'flex', flexDirection:'column', gap:'10px'}}>
                 <input type="text" placeholder="Image URL..." value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} style={styles.inputImage} />
                 <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
                   <button onClick={handleSave} style={styles.saveBtn}>Save</button>
                   <button onClick={() => { setIsEditingImage(false); setNewImageUrl(formData.profileImage); }} style={styles.cancelBtn}>Cancel</button>
                 </div>
              </div>
            ) : (
              <button onClick={() => setIsEditingImage(true)} style={styles.editImageBtn}>Change Picture</button>
            )}
          </div>

          {/* Card ขวา */}
          <div style={styles.rightCard}>
            <div style={styles.cardHeader}>
              <h3 style={{margin: 0, color: '#2a2421', fontSize: '22px'}}>Personal Information</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} style={styles.editModeBtn}>
                  Edit Profile
                </button>
              )}
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name</label>
                <input 
                  style={isEditing ? styles.inputActive : styles.inputView} 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                  readOnly={!isEditing}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name</label>
                <input 
                  style={isEditing ? styles.inputActive : styles.inputView} 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>User ID</label>
              <input style={{...styles.inputView, backgroundColor: '#f5f5f5', color: '#999'}} value={formData.user_id} readOnly />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input 
                style={isEditing ? styles.inputActive : styles.inputView} 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                readOnly={!isEditing}
              />
            </div>

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
  container: { minHeight: '100vh', backgroundColor: '#2a2421', fontFamily: 'Arial, sans-serif' }, // สีพื้นหลัง
  contentWrapper: { padding: '50px', width: '100%', boxSizing: 'border-box', maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '30px' },
  
  cardsContainer: { display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap', width: '100%' },
  headerTitle: { color: '#F6E2B3', marginBottom: '10px', fontSize: '28px', letterSpacing: '1px' },
  
  leftCard: { 
    backgroundColor: '#ffffff', 
    borderRadius: '20px', 
    padding: '40px', 
    width: '320px', 
    flexShrink: 0, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)' 
  },
  
  rightCard: { 
    backgroundColor: '#ffffff', 
    borderRadius: '20px', 
    padding: '40px 50px', 
    flex: 1, 
    minWidth: '400px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column'
  },

  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', width: '100%' },

  editModeBtn: { background: 'rgba(190, 155, 121, 0.15)', border: 'none', color: '#4D3D2E', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px' },

  avatarContainer: { width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', marginBottom: '25px', border: '6px solid #f5f5f5', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  
  row: { display: 'flex', gap: '25px', marginBottom: '20px' },
  formGroup: { flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '20px' },
  label: { fontWeight: 'bold', marginBottom: '8px', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' },
  
  inputImage: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none' },
  inputActive: { padding: '14px', borderRadius: '10px', border: '1px solid #be9b79', fontSize: '16px', width: '100%', backgroundColor: '#fff', outline: 'none', color: '#333' },
  inputView: { padding: '14px', borderRadius: '10px', border: '1px solid transparent', fontSize: '16px', width: '100%', backgroundColor: '#fcfcfc', fontWeight: '500', color: '#333', outline: 'none' },

  editImageBtn: { padding: '10px 20px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#555' },
  saveBtn: { flex: 1, padding: '10px', backgroundColor: '#4D3D2E', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { flex: 1, padding: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  
  actionRow: { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px', paddingTop: '20px' },
  
  saveBtnLarge: { padding: '14px 30px', backgroundColor: '#be9b79', color: '#2a2421', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  cancelBtnLarge: { padding: '14px 30px', backgroundColor: '#f0f0f0', color: '#555', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  logoutBtnLarge: { padding: '14px 30px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};