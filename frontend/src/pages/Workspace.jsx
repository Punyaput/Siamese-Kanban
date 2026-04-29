import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  const [hoveredId, setHoveredId] = useState(null);
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
      setLoading(false);
      setTimeout(() => setVisible(true), 50);
    } catch (err) {
      if (err.response?.status === 401) { localStorage.removeItem('token'); navigate('/auth'); }
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName) return;
    try {
      await axios.post(`${API_BASE_URL}/api/projects`, { name: newProjectName }, { headers: { Authorization: `Bearer ${token}` } });
      setNewProjectName(''); setIsModalOpen(false); fetchProjects();
    } catch { alert('Failed to create project'); }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Delete this project? All data will be lost.')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/projects/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchProjects();
    } catch { alert('Failed to delete'); }
  };

  const openRenameModal = (project) => {
    setRenameProjectId(project._id); setRenameProjectName(project.name);
    setIsRenameModalOpen(true); setActiveMenuId(null);
  };

  const handleRenameProject = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/projects/${renameProjectId}`, { name: renameProjectName }, { headers: { Authorization: `Bearer ${token}` } });
      setIsRenameModalOpen(false); fetchProjects();
    } catch { alert('Failed to rename'); }
  };

  useEffect(() => {
    if (!token) { navigate('/auth'); return; }
    fetchProjects();
    const close = () => setActiveMenuId(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const isOwner = (project) => project.ownerId === user.user_id;

  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.loadingDot} />
    </div>
  );

  return (
    <div style={styles.container}>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Project" onSubmit={handleCreateProject}>
        <input type="text" placeholder="Project name..." value={newProjectName}
          onChange={e => setNewProjectName(e.target.value)} autoFocus style={styles.input} />
      </Modal>
      <Modal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)} title="Rename Project" onSubmit={handleRenameProject}>
        <input type="text" value={renameProjectName}
          onChange={e => setRenameProjectName(e.target.value)} autoFocus style={styles.input} />
      </Modal>

      <div style={styles.inner}>
        <div style={styles.pageHeader}>
          <div>
            <div style={styles.eyebrow}>WORKSPACE</div>
            <h1 style={styles.heading}>{user.firstName || user.user_id}</h1>
          </div>
          <button style={styles.newBtn} onClick={() => setIsModalOpen(true)}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F6E2B3'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#be9b79'}>
            + New Project
          </button>
        </div>

        <div style={styles.divider} />

        <div style={styles.grid}>
          {projects.map((project, i) => (
            <div
              key={project._id}
              style={{
                ...styles.card,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`,
                ...(hoveredId === project._id ? styles.cardHover : {})
              }}
              onClick={() => navigate(`/project/${project._id}`)}
              onMouseEnter={() => setHoveredId(project._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div style={styles.cardAccent} />

              <div style={styles.cardTop}>
                <div style={styles.cardIcon}>
                  {project.name[0].toUpperCase()}
                </div>
                {!isOwner(project) && (
                  <span style={styles.sharedBadge}>SHARED</span>
                )}
              </div>

              <div style={styles.cardTitle}>{project.name}</div>
              <div style={styles.cardMeta}>
                {new Date(project.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>

              {isOwner(project) && (
                <div
                  style={styles.menuTrigger}
                  onClick={e => { e.stopPropagation(); setActiveMenuId(activeMenuId === project._id ? null : project._id); }}
                >
                  ···
                </div>
              )}

              {activeMenuId === project._id && (
                <div style={styles.menu} onClick={e => e.stopPropagation()}>
                  <div style={styles.menuItem} onClick={() => openRenameModal(project)}>Rename</div>
                  <div style={{ ...styles.menuItem, ...styles.menuItemDanger }} onClick={() => handleDeleteProject(project._id)}>Delete</div>
                </div>
              )}
            </div>
          ))}

          {projects.length === 0 && (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>◈</div>
              <div style={styles.emptyText}>No projects yet.<br />Create your first one.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#1a1210', fontFamily: "'Segoe UI', sans-serif" },
  loading: { minHeight: '100vh', backgroundColor: '#1a1210', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loadingDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#be9b79', animation: 'pulse 1s infinite' },
  inner: { maxWidth: '1200px', margin: '0 auto', padding: '60px 40px' },
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' },
  eyebrow: { fontSize: '11px', letterSpacing: '4px', color: '#be9b79', marginBottom: '8px', opacity: 0.7 },
  heading: { fontSize: '42px', fontFamily: 'Georgia, serif', fontWeight: '800', color: '#F6E2B3', margin: 0, lineHeight: 1 },
  divider: { height: '1px', backgroundColor: 'rgba(190,155,121,0.2)', marginBottom: '48px' },
  newBtn: {
    padding: '12px 28px', backgroundColor: '#be9b79', color: '#1a1210',
    border: 'none', borderRadius: '4px', fontWeight: '700', fontSize: '14px',
    cursor: 'pointer', letterSpacing: '0.5px', transition: 'background-color 0.2s ease',
    fontFamily: 'Georgia, serif',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' },
  card: {
    backgroundColor: '#231a17',
    border: '1px solid rgba(190,155,121,0.15)',
    borderRadius: '8px',
    padding: '28px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.25s ease',
  },
  cardHover: {
    border: '1px solid rgba(190,155,121,0.5)',
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
    backgroundColor: '#2a2018',
  },
  cardAccent: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
    background: 'linear-gradient(90deg, #be9b79, #F6E2B3, #be9b79)',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  cardIcon: {
    width: '44px', height: '44px', borderRadius: '8px',
    backgroundColor: 'rgba(190,155,121,0.15)',
    border: '1px solid rgba(190,155,121,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px', fontWeight: '800', color: '#be9b79',
    fontFamily: 'Georgia, serif',
  },
  sharedBadge: {
    fontSize: '9px', letterSpacing: '2px', color: '#be9b79',
    border: '1px solid rgba(190,155,121,0.4)', borderRadius: '2px',
    padding: '3px 8px',
  },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#F6E2B3', marginBottom: '10px', fontFamily: 'Georgia, serif', wordBreak: 'break-word' },
  cardMeta: { fontSize: '12px', color: 'rgba(246,226,179,0.35)', letterSpacing: '0.3px' },
  menuTrigger: {
    position: 'absolute', top: '16px', right: '16px',
    color: 'rgba(190,155,121,0.5)', cursor: 'pointer', fontSize: '18px',
    padding: '4px 8px', borderRadius: '4px', letterSpacing: '2px',
    transition: 'color 0.2s',
  },
  menu: {
    position: 'absolute', top: '44px', right: '12px',
    backgroundColor: '#2e2118', border: '1px solid rgba(190,155,121,0.25)',
    borderRadius: '6px', overflow: 'hidden', zIndex: 20, minWidth: '120px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
  },
  menuItem: { padding: '11px 16px', fontSize: '14px', color: '#F6E2B3', cursor: 'pointer', transition: 'background 0.15s' },
  menuItemDanger: { color: '#e07070', borderTop: '1px solid rgba(190,155,121,0.15)' },
  input: { width: '100%', padding: '12px', fontSize: '15px', borderRadius: '6px', border: '1px solid rgba(190,155,121,0.3)', outline: 'none', backgroundColor: '#2e2118', color: '#F6E2B3', fontFamily: 'Georgia, serif' },
  empty: { gridColumn: '1/-1', textAlign: 'center', padding: '80px 0' },
  emptyIcon: { fontSize: '40px', color: 'rgba(190,155,121,0.3)', marginBottom: '16px' },
  emptyText: { color: 'rgba(246,226,179,0.35)', fontSize: '15px', lineHeight: 1.8, fontFamily: 'Georgia, serif' },
};