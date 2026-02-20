import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Modal from '../components/common/Modal';

export default function Workspace() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameProjectId, setRenameProjectId] = useState(null);
  const [renameProjectName, setRenameProjectName] = useState('');

  const [activeMenuId, setActiveMenuId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    try {
      await axios.post(`${API_BASE_URL}/api/projects`,
        { name: newProjectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewProjectName('');
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) { alert('สร้าง Project ไม่สำเร็จ'); }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('ยืนยันการลบโปรเจกต์? ข้อมูลข้างในจะหายทั้งหมด')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (error) { alert('ลบไม่สำเร็จ'); }
  };

  const openRenameModal = (project) => {
    setRenameProjectId(project._id);
    setRenameProjectName(project.name);
    setIsRenameModalOpen(true);
    setActiveMenuId(null);
  };

  const handleRenameProject = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/projects/${renameProjectId}`,
        { name: renameProjectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsRenameModalOpen(false);
      fetchProjects();
    } catch (err) { alert('เปลี่ยนชื่อไม่สำเร็จ'); }
  };

  useEffect(() => {
    if (!token) navigate('/auth');
    else fetchProjects();

    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [token, navigate]);

  if (loading) return <div style={{ padding: '40px', color: '#be9b79', backgroundColor: '#2a2421', minHeight: '100vh' }}>Loading...</div>;

  return (
    <div style={styles.container}>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project" onSubmit={handleCreateProject}>
        <input type="text" placeholder="Project Name..." value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} autoFocus style={styles.input} />
      </Modal>

      <Modal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)} title="Rename Project" onSubmit={handleRenameProject}>
        <input type="text" placeholder="New Name..." value={renameProjectName} onChange={(e) => setRenameProjectName(e.target.value)} autoFocus style={styles.input} />
      </Modal>

      <div style={styles.content}>
        <h2 style={styles.headerTitle}>{user.firstName || user.user_id}'s Workspace</h2>

        <div style={styles.grid}>
          {/* New Project Card */}
          <div style={styles.newCard} onClick={() => setIsModalOpen(true)}>
            <span style={styles.newCardIcon}>+</span>
            <span style={styles.newCardText}>New Project</span>
          </div>

          {/* Project List */}
          {projects.map((project) => (
            <div
              key={project._id}
              style={styles.card}
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <div
                style={styles.menuTrigger}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(activeMenuId === project._id ? null : project._id);
                }}
              >
                ⋮
              </div>

              {activeMenuId === project._id && (
                <div style={styles.menuPopup} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.menuItem} onClick={() => openRenameModal(project)}>Rename</div>
                  <div style={{ ...styles.menuItem, color: '#e74c3c' }} onClick={() => handleDeleteProject(project._id)}>Delete</div>
                </div>
              )}

              <div style={styles.cardTitle}>{project.name}</div>
              <div style={styles.cardDate}>Created: {new Date(project.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#2a2421', display: 'flex', flexDirection: 'column' }, // เปลี่ยนสีพื้นหลัง
  content: { padding: '50px', flex: 1 },
  headerTitle: { color: '#F6E2B3', marginBottom: '40px', fontSize: '28px', fontWeight: 'bold', letterSpacing: '1px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }, // ใช้ Grid ให้การ์ดเรียงสวยงาม

  newCard: {
    height: '160px',
    backgroundColor: 'rgba(190, 155, 121, 0.05)',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: '2px dashed rgba(190, 155, 121, 0.5)',
    transition: '0.3s'
  },
  newCardIcon: { fontSize: '40px', marginBottom: '5px', color: '#be9b79' },
  newCardText: { color: '#be9b79', fontWeight: '600', fontSize: '16px' },

  card: {
    height: '160px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '25px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    position: 'relative',
    transition: 'transform 0.2s ease, boxShadow 0.2s ease'
  },
  cardTitle: { fontWeight: '800', fontSize: '20px', color: '#2a2421', marginTop: '10px', wordBreak: 'break-word' },
  cardDate: { fontSize: '13px', color: '#888', alignSelf: 'flex-start', fontWeight: '500' },

  input: { width: '100%', padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },

  menuTrigger: { position: 'absolute', top: '15px', right: '15px', fontSize: '24px', color: '#999', cursor: 'pointer', padding: '0 5px', zIndex: 10, lineHeight: '1' },
  menuPopup: { position: 'absolute', top: '45px', right: '20px', backgroundColor: 'white', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', borderRadius: '8px', zIndex: 20, width: '130px', border: '1px solid #eee', overflow: 'hidden' },
  menuItem: { padding: '12px 15px', fontSize: '14px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', color: '#333', fontWeight: '500' }
};