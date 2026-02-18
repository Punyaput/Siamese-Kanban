import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Modal from '../components/common/Modal';

export default function Workspace() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameProjectId, setRenameProjectId] = useState(null);
  const [renameProjectName, setRenameProjectName] = useState('');
  
  // Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects', {
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

  // Create Project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    try {
      await axios.post('http://localhost:5000/api/projects', 
        { name: newProjectName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewProjectName('');
      setIsModalOpen(false);
      fetchProjects(); 
    } catch (error) { alert('สร้าง Project ไม่สำเร็จ'); }
  };

  // Delete Project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('ยืนยันการลบโปรเจกต์? ข้อมูลข้างในจะหายทั้งหมด')) return;
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (error) { alert('ลบไม่สำเร็จ'); }
  };

  // Rename Project
  const openRenameModal = (project) => {
    setRenameProjectId(project._id);
    setRenameProjectName(project.name);
    setIsRenameModalOpen(true);
    setActiveMenuId(null);
  };

  const handleRenameProject = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/projects/${renameProjectId}`,
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
    
    // Close menu when clicking outside
    const handleClickOutside = () => setActiveMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [token, navigate]);

  if (loading) return <div style={{padding: '20px', color: 'white'}}>Loading...</div>;

  return (
    <div style={styles.container}>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project" onSubmit={handleCreateProject}>
        <input type="text" placeholder="Project Name..." value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} autoFocus style={styles.input} />
      </Modal>

      <Modal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)} title="Rename Project" onSubmit={handleRenameProject}>
        <input type="text" placeholder="New Name..." value={renameProjectName} onChange={(e) => setRenameProjectName(e.target.value)} autoFocus style={styles.input} />
      </Modal>

      <div style={styles.content}>
        <h2 style={styles.headerTitle}>Workspace ของ {user.firstName || user.user_id}</h2>

        <div style={styles.grid}>
          {/* New Project Card */}
          <div style={styles.newCard} onClick={() => setIsModalOpen(true)}>
            <span style={{fontSize: '40px', marginBottom: '10px'}}>+</span>
            <span>New Project</span>
          </div>

          {/* Project List */}
          {projects.map((project) => (
            <div 
              key={project._id} 
              style={styles.card}
              onClick={() => navigate(`/project/${project._id}`)}
            >
              {/* Menu Trigger (3 Dots) */}
              <div 
                style={styles.menuTrigger}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(activeMenuId === project._id ? null : project._id);
                }}
              >
                ⋮
              </div>

              {/* Popup Menu */}
              {activeMenuId === project._id && (
                <div style={styles.menuPopup} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.menuItem} onClick={() => openRenameModal(project)}>✏️ Rename</div>
                  <div style={{...styles.menuItem, color: 'red'}} onClick={() => handleDeleteProject(project._id)}>🗑️ Delete</div>
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
  container: { minHeight: '100vh', backgroundColor: '#9a9a9a', display: 'flex', flexDirection: 'column' },
  content: { padding: '40px', flex: 1 },
  headerTitle: { color: 'white', marginBottom: '30px' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  
  newCard: { width: '220px', height: '150px', backgroundColor: '#ccc', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#333', fontWeight: 'bold', border: '2px dashed #666' },
  
  card: { width: '220px', height: '150px', backgroundColor: 'white', borderRadius: '10px', padding: '15px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', position: 'relative' },
  cardTitle: { fontWeight: 'bold', fontSize: '18px', color: '#333', marginTop: '15px' },
  cardDate: { fontSize: '12px', color: '#888', alignSelf: 'flex-end' },
  
  input: { width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ddd' },
  
  menuTrigger: { position: 'absolute', top: '5px', right: '5px', fontSize: '24px', color: '#666', cursor: 'pointer', padding: '0 10px', zIndex: 10 },
  menuPopup: { position: 'absolute', top: '35px', right: '10px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 20, width: '120px', border: '1px solid #eee' },
  menuItem: { padding: '10px', fontSize: '14px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', color: '#333' }
};