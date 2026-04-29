import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CategoryColumn from '../components/project/CategoryColumn';
import Modal from '../components/common/Modal';

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  // [CR-00010] Invite state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteUserId, setInviteUserId] = useState('');
  const [inviteMsg, setInviteMsg] = useState('');
  const [projectData, setProjectData] = useState(null);
  const token = localStorage.getItem('token');
  const [allTasks, setAllTasks] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


  const fetchProjectDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjectData(res.data);
      setProjectName(res.data.name);
    } catch { setProjectName('Board'); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
      await fetchAllTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchAllTasks = async (cats) => {
    const results = {};
    await Promise.all((cats || categories).map(async (cat) => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/tasks/${cat._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        results[cat._id] = res.data;
      } catch { results[cat._id] = []; }
    }));
    setAllTasks(results);
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/logs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setLogs(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDeleteCategory = async (catId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/categories/${catId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCategories();
    } catch { alert('Failed to delete column'); }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatalogName) return;
    try {
      await axios.post(`${API_BASE_URL}/api/categories`, { name: newCatalogName, projectId: id }, { headers: { Authorization: `Bearer ${token}` } });
      setNewCatalogName(''); setIsModalOpen(false); fetchCategories();
    } catch { alert('Failed to create column'); }
  };

  // [CR-00010] Invite handler
  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/projects/${id}/invite`, { userId: inviteUserId }, { headers: { Authorization: `Bearer ${token}` } });
      setInviteMsg(`✓ ${inviteUserId} added successfully`);
      setInviteUserId('');
    } catch (err) {
      setInviteMsg(err.response?.data?.message || 'Failed to invite');
    }
  };

  useEffect(() => {
    if (!token) { navigate('/auth'); return; }
    fetchProjectDetails();
    fetchCategories();
    fetchLogs();
  }, [id, refreshKey, token, navigate]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'COLUMN') {
      const reordered = Array.from(categories);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      setCategories(reordered);
      try {
        await axios.put(`${API_BASE_URL}/api/categories/move/${draggableId}`,
          { newOrder: destination.index },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch { alert('Failed to move column'); fetchCategories(); }
      return;
    }

    // Optimistic task move
    const sourceTasks = Array.from(allTasks[source.droppableId] || []);
    const destTasks = source.droppableId === destination.droppableId
      ? sourceTasks
      : Array.from(allTasks[destination.droppableId] || []);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, movedTask);

    setAllTasks(prev => ({
      ...prev,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destTasks,
    }));

    try {
      await axios.put(`${API_BASE_URL}/api/tasks/move/${draggableId}`,
        { categoryId: destination.droppableId, newOrder: destination.index },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLogs();
    } catch {
      alert('Failed to move task');
      fetchCategories(); // revert on error
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => navigate('/workspace')}>← Back</button>
          <div>
            <div style={styles.headerEyebrow}>PROJECT BOARD</div>
            <h2 style={styles.headerTitle}>{projectName}</h2>
            {projectData?.members?.length > 0 && (
              <div style={styles.membersList}>
                <span style={styles.membersLabel}>👥 Members:</span>
                {projectData.members.map((m, i) => (
                  <span key={i} style={styles.memberChip}>{m}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={styles.headerActions}>
          {/* [CR-00010] Invite button */}
          <button style={styles.inviteBtn} onClick={() => { setIsInviteOpen(!isInviteOpen); setInviteMsg(''); }}>
            + Invite
          </button>
          <button style={styles.addColBtn} onClick={() => setIsModalOpen(true)}>
            + Add Column
          </button>
        </div>
      </div>

      {/* [CR-00010] Invite panel */}
      {isInviteOpen && (
        <div style={styles.invitePanel}>
          <form onSubmit={handleInvite} style={styles.inviteForm}>
            <input
              value={inviteUserId}
              onChange={e => setInviteUserId(e.target.value)}
              placeholder="Enter username (user_id)..."
              style={styles.inviteInput}
              autoFocus
            />
            <button type="submit" style={styles.inviteSubmit}>Invite</button>
          </form>
          {inviteMsg && <div style={styles.inviteMsg}>{inviteMsg}</div>}
        </div>
      )}

      {/* New column modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Column" onSubmit={handleCreateCategory}>
        <input type="text" placeholder="Column name..." value={newCatalogName}
          onChange={e => setNewCatalogName(e.target.value)} autoFocus
          style={{ width: '100%', padding: '12px', fontSize: '15px', borderRadius: '6px', border: '1px solid rgba(190,155,121,0.3)', backgroundColor: '#2e2118', color: '#F6E2B3', outline: 'none' }} />
      </Modal>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.boardCanvas}>
          <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
            {(provided) => (
              <div style={styles.columnsContainer} {...provided.droppableProps} ref={provided.innerRef}>
                {categories.map((category, index) => (
                  <Draggable key={category._id} draggableId={category._id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}
                        style={{ ...styles.columnWrapper, ...provided.draggableProps.style }}>
                        <CategoryColumn
                          category={category}
                          tasks={allTasks[category._id] || []}
                          onDeleteCategory={handleDeleteCategory}
                          dragHandleProps={provided.dragHandleProps}
                          onTaskChange={fetchCategories}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      {/* [CR-00008] Activity log panel */}
      <div style={styles.logPanel}>
        <div style={styles.logHeader} onClick={() => { setShowLogs(!showLogs); if (!showLogs) fetchLogs(); }}>
          <span>📋 Activity</span>
          <span style={{ fontSize: '11px', opacity: 0.6 }}>{showLogs ? '▲ hide' : '▼ show'}</span>
        </div>
        {showLogs && (
          <div style={styles.logList}>
            {logs.length === 0 ? (
              <div style={styles.logEmpty}>No activity yet.</div>
            ) : logs.map((log, i) => (
              <div key={i} style={styles.logItem}>
                <div style={styles.logAction}>{log.action}</div>
                <div style={styles.logTask}>"{log.taskTitle}"</div>
                <div style={styles.logMeta}>by {log.performedBy} · {new Date(log.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1210' },
  header: {
    padding: '20px 36px 16px',
    borderBottom: '1px solid rgba(190,155,121,0.15)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#1e1511', flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  backBtn: {
    background: 'none', border: '1px solid rgba(190,155,121,0.25)',
    color: 'rgba(246,226,179,0.5)', cursor: 'pointer', padding: '6px 14px',
    borderRadius: '4px', fontSize: '13px', fontFamily: 'Georgia, serif',
    transition: 'all 0.2s',
  },
  headerEyebrow: { fontSize: '9px', letterSpacing: '3px', color: '#be9b79', opacity: 0.6, marginBottom: '4px' },
  headerTitle: { margin: 0, color: '#F6E2B3', fontSize: '22px', fontFamily: 'Georgia, serif', fontWeight: '700' },
  headerActions: { display: 'flex', gap: '10px' },
  inviteBtn: {
    padding: '8px 20px', backgroundColor: 'transparent',
    border: '1px solid rgba(190,155,121,0.4)', color: '#be9b79',
    borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '13px',
    fontFamily: 'Georgia, serif', transition: 'all 0.2s',
  },
  addColBtn: {
    padding: '8px 20px', backgroundColor: '#be9b79',
    border: 'none', color: '#1a1210',
    borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '13px',
    fontFamily: 'Georgia, serif',
  },
  invitePanel: {
    backgroundColor: '#1e1511', borderBottom: '1px solid rgba(190,155,121,0.15)',
    padding: '14px 36px', flexShrink: 0,
  },
  inviteForm: { display: 'flex', gap: '10px', alignItems: 'center' },
  inviteInput: {
    padding: '8px 14px', borderRadius: '4px', fontSize: '14px',
    border: '1px solid rgba(190,155,121,0.3)', backgroundColor: '#2e2118',
    color: '#F6E2B3', outline: 'none', width: '280px', fontFamily: 'Georgia, serif',
  },
  inviteSubmit: {
    padding: '8px 20px', backgroundColor: '#be9b79', border: 'none',
    borderRadius: '4px', color: '#1a1210', fontWeight: '700', cursor: 'pointer', fontSize: '13px',
  },
  inviteMsg: { marginTop: '8px', fontSize: '13px', color: '#be9b79', fontFamily: 'Georgia, serif' },
  boardCanvas: { flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '28px 36px' },
  columnsContainer: { display: 'flex', height: '100%', alignItems: 'flex-start' },
  columnWrapper: { marginRight: '20px', flexShrink: 0 },
  logPanel: {
    position: 'fixed', bottom: 0, right: '28px', width: '320px',
    backgroundColor: '#1e1511', borderRadius: '8px 8px 0 0',
    border: '1px solid rgba(190,155,121,0.2)', borderBottom: 'none', zIndex: 500,
    boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
  },
  logHeader: {
    padding: '10px 16px', color: '#be9b79', cursor: 'pointer',
    display: 'flex', justifyContent: 'space-between', fontSize: '13px',
    fontFamily: 'Georgia, serif', fontWeight: '600', letterSpacing: '0.3px',
  },
  logList: { maxHeight: '200px', overflowY: 'auto', padding: '8px 16px 12px' },
  logEmpty: { color: 'rgba(246,226,179,0.3)', fontSize: '13px', textAlign: 'center', padding: '12px 0', fontFamily: 'Georgia, serif', fontStyle: 'italic' },
  logItem: { borderBottom: '1px solid rgba(190,155,121,0.08)', paddingBottom: '8px', marginBottom: '8px' },
  logAction: { fontSize: '11px', fontWeight: '700', color: '#be9b79', letterSpacing: '1px' },
  logTask: { fontSize: '13px', color: '#F6E2B3', margin: '2px 0', fontFamily: 'Georgia, serif' },
  logMeta: { fontSize: '11px', color: 'rgba(246,226,179,0.35)' },
  membersList: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' },
  membersLabel: { fontSize: '11px', color: 'rgba(190,155,121,0.5)', letterSpacing: '0.5px' },
  memberChip: { fontSize: '11px', color: '#be9b79', backgroundColor: 'rgba(190,155,121,0.1)', border: '1px solid rgba(190,155,121,0.25)', padding: '2px 8px', borderRadius: '3px' },
};