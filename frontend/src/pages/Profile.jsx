import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [formData, setFormData] = useState({ user_id: '', firstName: '', lastName: '', email: '', profileImage: '' });
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      setFormData(res.data);
      setNewImageUrl(res.data.profileImage || '');
    } catch (err) {
      if (err.response?.status === 401) navigate('/auth');
    }
  };

  useEffect(() => {
    if (!token) { navigate('/auth'); return; }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await axios.put(`${API_BASE_URL}/api/auth/update`,
        { ...formData, profileImage: newImageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData(res.data);
      setIsEditingImage(false);
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...res.data }));
    } catch { alert('Save failed'); }
  };

  const handleLogout = () => {
    if (window.confirm('Log out?')) { localStorage.clear(); navigate('/auth'); }
  };

  const initial = (formData.firstName || formData.user_id || '?')[0].toUpperCase();

  return (
    <div style={styles.container}>
      <div style={styles.inner}>

        <div style={styles.pageHeader}>
          <div style={styles.eyebrow}>ACCOUNT</div>
          <h1 style={styles.heading}>My Profile</h1>
        </div>
        <div style={styles.divider} />

        <div style={styles.layout}>

          {/* LEFT — Avatar card */}
          <div style={styles.leftCard}>
            <div style={styles.avatarRing}>
              {newImageUrl || formData.profileImage ? (
                <img src={newImageUrl || formData.profileImage} alt="Profile"
                  style={styles.avatarImg}
                  onError={e => { e.target.style.display = 'none'; }} />
              ) : (
                <div style={styles.avatarInitial}>{initial}</div>
              )}
            </div>

            <div style={styles.userHandle}>@{formData.user_id}</div>
            <div style={styles.userName}>{formData.firstName} {formData.lastName}</div>

            {isEditingImage ? (
              <div style={styles.imageEditBox}>
                <input
                  type="text" placeholder="Paste image URL..."
                  value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)}
                  style={styles.imageInput} autoFocus
                />
                <div style={styles.imageEditBtns}>
                  <button onClick={handleSave} style={styles.applyBtn}>Apply</button>
                  <button onClick={() => { setIsEditingImage(false); setNewImageUrl(formData.profileImage || ''); }} style={styles.ghostBtn}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsEditingImage(true)} style={styles.changePicBtn}>
                Change Picture
              </button>
            )}

            <button onClick={handleLogout} style={styles.logoutBtn}>
              Sign Out
            </button>
          </div>

          {/* RIGHT — Info card */}
          <div style={styles.rightCard}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Personal Information</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} style={styles.editBtn}>Edit</button>
              )}
            </div>

            {saved && (
              <div style={styles.savedBanner}>✓ Changes saved successfully</div>
            )}

            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>First Name</label>
                <input
                  style={isEditing ? styles.inputActive : styles.inputView}
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  readOnly={!isEditing}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Last Name</label>
                <input
                  style={isEditing ? styles.inputActive : styles.inputView}
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  readOnly={!isEditing}
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input style={styles.inputLocked} value={formData.user_id} readOnly />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={isEditing ? styles.inputActive : styles.inputView}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                readOnly={!isEditing}
              />
            </div>

            {isEditing && (
              <div style={styles.actionRow}>
                <button onClick={() => { setIsEditing(false); fetchProfile(); }} style={styles.ghostBtn}>Cancel</button>
                <button onClick={handleSave} style={styles.applyBtn}>Save Changes</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#1a1210', fontFamily: "'Segoe UI', sans-serif" },
  inner: { maxWidth: '1100px', margin: '0 auto', padding: '60px 40px' },
  pageHeader: { marginBottom: '24px' },
  eyebrow: { fontSize: '11px', letterSpacing: '4px', color: '#be9b79', opacity: 0.7, marginBottom: '8px' },
  heading: { fontSize: '42px', fontFamily: 'Georgia, serif', fontWeight: '800', color: '#F6E2B3', margin: 0 },
  divider: { height: '1px', backgroundColor: 'rgba(190,155,121,0.2)', marginBottom: '48px' },

  layout: { display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' },

  leftCard: {
    width: '280px', flexShrink: 0,
    backgroundColor: '#231a17',
    border: '1px solid rgba(190,155,121,0.15)',
    borderRadius: '12px', padding: '36px 28px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '12px',
  },
  avatarRing: {
    width: '120px', height: '120px', borderRadius: '50%',
    border: '2px solid rgba(190,155,121,0.4)',
    overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2e2118', marginBottom: '8px',
    boxShadow: '0 0 0 4px rgba(190,155,121,0.08)',
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarInitial: { fontSize: '48px', fontWeight: '800', color: '#be9b79', fontFamily: 'Georgia, serif' },
  userHandle: { fontSize: '13px', color: 'rgba(190,155,121,0.6)', letterSpacing: '0.5px' },
  userName: { fontSize: '18px', fontWeight: '700', color: '#F6E2B3', fontFamily: 'Georgia, serif', textAlign: 'center' },

  imageEditBox: { width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' },
  imageInput: { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(190,155,121,0.3)', backgroundColor: '#1a1210', color: '#F6E2B3', fontSize: '12px', outline: 'none', fontFamily: 'Georgia, serif', boxSizing: 'border-box' },
  imageEditBtns: { display: 'flex', gap: '8px' },

  changePicBtn: { width: '100%', padding: '9px', backgroundColor: 'transparent', border: '1px solid rgba(190,155,121,0.3)', borderRadius: '6px', color: '#be9b79', cursor: 'pointer', fontSize: '13px', fontFamily: 'Georgia, serif', transition: 'all 0.2s', marginTop: '4px' },
  logoutBtn: { width: '100%', padding: '9px', backgroundColor: 'transparent', border: '1px solid rgba(224,112,112,0.3)', borderRadius: '6px', color: '#e07070', cursor: 'pointer', fontSize: '13px', fontFamily: 'Georgia, serif', marginTop: '4px' },

  rightCard: {
    flex: 1, minWidth: '360px',
    backgroundColor: '#231a17',
    border: '1px solid rgba(190,155,121,0.15)',
    borderRadius: '12px', padding: '36px 40px',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', paddingBottom: '16px', borderBottom: '1px solid rgba(190,155,121,0.1)' },
  cardTitle: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#F6E2B3', fontFamily: 'Georgia, serif' },
  editBtn: { padding: '7px 18px', backgroundColor: 'transparent', border: '1px solid rgba(190,155,121,0.35)', borderRadius: '5px', color: '#be9b79', cursor: 'pointer', fontSize: '13px', fontFamily: 'Georgia, serif' },

  savedBanner: { backgroundColor: 'rgba(106,170,122,0.12)', border: '1px solid rgba(106,170,122,0.3)', borderRadius: '6px', padding: '10px 14px', color: '#6aaa7a', fontSize: '13px', marginBottom: '20px', fontFamily: 'Georgia, serif' },

  row: { display: 'flex', gap: '20px', marginBottom: '4px' },
  field: { flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '20px' },
  label: { fontSize: '11px', fontWeight: '600', color: 'rgba(190,155,121,0.6)', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' },

  inputView: { padding: '12px 14px', borderRadius: '7px', border: '1px solid transparent', fontSize: '15px', backgroundColor: '#1a1210', color: '#F6E2B3', outline: 'none', fontFamily: 'Georgia, serif' },
  inputActive: { padding: '12px 14px', borderRadius: '7px', border: '1px solid rgba(190,155,121,0.4)', fontSize: '15px', backgroundColor: '#1a1210', color: '#F6E2B3', outline: 'none', fontFamily: 'Georgia, serif' },
  inputLocked: { padding: '12px 14px', borderRadius: '7px', border: '1px solid transparent', fontSize: '15px', backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(246,226,179,0.3)', outline: 'none', fontFamily: 'Georgia, serif' },

  actionRow: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '20px', borderTop: '1px solid rgba(190,155,121,0.1)' },
  applyBtn: { padding: '9px 24px', backgroundColor: '#be9b79', border: 'none', borderRadius: '6px', color: '#1a1210', fontWeight: '700', cursor: 'pointer', fontSize: '14px', fontFamily: 'Georgia, serif' },
  ghostBtn: { padding: '9px 20px', backgroundColor: 'transparent', border: '1px solid rgba(190,155,121,0.25)', borderRadius: '6px', color: 'rgba(246,226,179,0.5)', cursor: 'pointer', fontSize: '14px', fontFamily: 'Georgia, serif' },
};