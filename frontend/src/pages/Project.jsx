import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import CategoryColumn from '../components/project/CategoryColumn';
import Modal from '../components/common/Modal';

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate(); // เพิ่ม useNavigate สำหรับเช็ค token
  const [categories, setCategories] = useState([]);
  const [projectName, setProjectName] = useState('Loading...');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState('');
  const token = localStorage.getItem('token');

  const [refreshKey, setRefreshKey] = useState(0);

  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // --- 1. เพิ่มฟังก์ชันดึงชื่อ Project ตรงนี้ ---
  const fetchProjectDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjectName(res.data.name); // นำชื่อโปรเจกต์ของจริงมาแสดง
    } catch (err) {
      console.error('Error fetching project details:', err);
      setProjectName(`Board ID: ${id.substring(0, 6)}...`); // สำรองไว้เผื่อ Error
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
      // เอา setProjectName แบบเก่าออกไปแล้วครับ
    } catch (err) { console.error(err); }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/logs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  const handleDeleteCategory = async (catId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/categories/${catId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (err) { alert('ลบไม่สำเร็จ'); }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatalogName) return;
    try {
      await axios.post(`${API_BASE_URL}/api/categories`,
        { name: newCatalogName, projectId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCatalogName('');
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) { alert('สร้าง Catalog ไม่สำเร็จ'); }
  };

  // --- 2. เรียกใช้งานใน useEffect ---
  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }
    fetchProjectDetails(); // ดึงชื่อโปรเจกต์
    fetchCategories();     // ดึงเสาต่างๆ
    fetchLogs();
  }, [id, refreshKey, token, navigate]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'COLUMN') {
      try {
        await axios.put(`${API_BASE_URL}/api/categories/move/${draggableId}`,
          { newOrder: destination.index },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRefreshKey(prev => prev + 1);
      } catch (err) {
        console.error(err);
        alert('ย้ายคอลัมน์ไม่สำเร็จ');
      }
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/api/tasks/move/${draggableId}`,
        {
          categoryId: destination.droppableId,
          newOrder: destination.index
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert('ย้ายงานไม่สำเร็จ');
    }
  };

  return (
    <div style={styles.container}>
      {/* จัดโครงสร้าง Header ให้อยู่ด้านบน */}
      <div style={styles.header}>
        <h2 style={{ color: '#F6E2B3', margin: 0, fontSize: '24px', letterSpacing: '0.5px' }}>
          {projectName}
        </h2>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Catalog" onSubmit={handleCreateCategory}>
          <input
            type="text"
            placeholder="Catalog Name..."
            value={newCatalogName}
            onChange={(e) => setNewCatalogName(e.target.value)}
            autoFocus
            style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
          />
        </Modal>

        <div style={styles.boardCanvas}>
          <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
            {(provided) => (
              <div
                style={styles.columnsContainer}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {categories.map((category, index) => (
                  <Draggable key={category._id} draggableId={category._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{ ...styles.columnWrapper, ...provided.draggableProps.style }}
                      >
                        <CategoryColumn
                          category={category}
                          onDeleteCategory={handleDeleteCategory}
                          dragHandleProps={provided.dragHandleProps}
                          refreshKey={refreshKey}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div onClick={() => setIsModalOpen(true)} style={styles.newColumnBtn}>
            + Add New Catalog
          </div>
        </div>

      </DragDropContext>

      {/* [CR-00008] Activity History Panel (FR-U4.2) */}
      <div style={styles.logPanel}>
        <div style={styles.logHeader} onClick={() => { setShowLogs(!showLogs); if (!showLogs) fetchLogs(); }}>
          <span>📋 Activity History</span>
          <span>{showLogs ? '▲' : '▼'}</span>
        </div>
        {showLogs && (
          <div style={styles.logList}>
            {logs.length === 0 ? (
              <div style={styles.logEmpty}>No activity yet.</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} style={styles.logItem}>
                  <span style={styles.logAction}>{log.action}</span>
                  <span style={styles.logTask}>"{log.taskTitle}"</span>
                  <span style={styles.logMeta}>by {log.performedBy} · {new Date(log.createdAt).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: 'calc(100vh - 60px)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#2a2421',
    padding: '30px 40px'
  },
  header: { marginBottom: '30px' },
  boardCanvas: {
    display: 'flex',
    overflowX: 'auto',
    height: '100%',
    alignItems: 'flex-start',
    paddingBottom: '20px'
  },
  columnsContainer: {
    display: 'flex',
    height: '100%'
  },
  columnWrapper: {
    marginRight: '20px'
  },
  newColumnBtn: {
    minWidth: '300px',
    height: '60px',
    backgroundColor: 'rgba(190, 155, 121, 0.05)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#be9b79',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    border: '2px dashed rgba(190, 155, 121, 0.4)',
    flexShrink: 0,
    transition: 'background-color 0.2s'
  },
  logPanel: { position: 'fixed', bottom: 0, right: '30px', width: '340px', backgroundColor: '#1e1b18', borderRadius: '10px 10px 0 0', border: '1px solid rgba(190,155,121,0.3)', zIndex: 500 },
  logHeader: { padding: '10px 16px', color: '#F6E2B3', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' },
  logList: { maxHeight: '220px', overflowY: 'auto', padding: '8px 16px 12px' },
  logEmpty: { color: '#888', fontSize: '13px', textAlign: 'center', padding: '10px' },
  logItem: { display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' },
  logAction: { fontSize: '12px', fontWeight: 'bold', color: '#be9b79' },
  logTask: { fontSize: '13px', color: '#eee' },
  logMeta: { fontSize: '11px', color: '#888' }
};