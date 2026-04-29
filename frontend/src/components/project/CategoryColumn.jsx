import { useState } from 'react';
import axios from 'axios';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import Modal from '../common/Modal';
import TaskDetailModal from './TaskDetailModal';

export default function CategoryColumn({ category, tasks = [], onDeleteCategory, dragHandleProps, onTaskChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const token = localStorage.getItem('token');
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
      onTaskChange();
    } catch { alert('Failed to delete task'); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskContent) return;
    try {
      await axios.post(`${API_BASE_URL}/api/tasks`,
        { title: newTaskContent, categoryId: category._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTaskContent(''); setIsModalOpen(false); onTaskChange();
    } catch { alert('Failed to create task'); }
  };

  return (
    <div
      style={{ ...styles.column, ...(isHovered ? styles.columnHovered : {}) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Task" onSubmit={handleCreateTask}>
        <input placeholder="Task name..." value={newTaskContent} onChange={e => setNewTaskContent(e.target.value)}
          autoFocus style={{ width: '100%', padding: '10px', fontSize: '14px', borderRadius: '6px', border: '1px solid rgba(190,155,121,0.3)', backgroundColor: '#2e2118', color: '#F6E2B3', outline: 'none' }} />
      </Modal>

      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelectedTask(null); }}
        task={selectedTask}
        onUpdate={() => { onTaskChange(); setIsDetailOpen(false); }}
        onDelete={handleDeleteTask}
      />

      <div style={styles.headerRow} {...dragHandleProps}>
        <div style={styles.headerLeft}>
          <div style={styles.headerDot} />
          <h3 style={styles.header}>{category.name}</h3>
          <span style={styles.taskCount}>{tasks.length}</span>
        </div>
        <button
          onMouseDown={e => e.stopPropagation()}
          onClick={() => { if (window.confirm(`Delete column "${category.name}"?`)) onDeleteCategory(category._id); }}
          style={styles.deleteColBtn}
        >✕</button>
      </div>

      <Droppable droppableId={category._id}>
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}
            style={{ ...styles.taskList, ...(snapshot.isDraggingOver ? styles.taskListOver : {}) }}>
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => {
                      setSelectedTask(tasks.find(t => t._id === task._id) || task);
                      setIsDetailOpen(true);
                    }}
                    style={{ ...styles.cardWrapper, ...(snapshot.isDragging ? styles.cardDragging : {}), ...provided.draggableProps.style }}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button onClick={() => setIsModalOpen(true)} style={styles.addTaskBtn}>
        <span style={styles.addTaskIcon}>+</span> Add Task
      </button>
    </div>
  );
}

const styles = {
  column: { width: '288px', minWidth: '288px', backgroundColor: '#231a17', borderRadius: '10px', border: '1px solid rgba(190,155,121,0.12)', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 180px)', transition: 'border-color 0.2s', overflow: 'hidden' },
  columnHovered: { border: '1px solid rgba(190,155,121,0.28)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 12px', borderBottom: '1px solid rgba(190,155,121,0.1)', cursor: 'grab', backgroundColor: '#2a2018' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  headerDot: { width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#be9b79', opacity: 0.7 },
  header: { margin: 0, fontSize: '14px', fontWeight: '700', color: '#F6E2B3', fontFamily: 'Georgia, serif', letterSpacing: '0.3px' },
  taskCount: { fontSize: '11px', color: '#be9b79', backgroundColor: 'rgba(190,155,121,0.15)', padding: '2px 7px', borderRadius: '10px', fontWeight: '600' },
  deleteColBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(190,155,121,0.3)', fontSize: '12px', padding: '4px', lineHeight: 1 },
  taskList: { flexGrow: 1, overflowY: 'auto', padding: '12px 10px', transition: 'background-color 0.15s' },
  taskListOver: { backgroundColor: 'rgba(190,155,121,0.05)' },
  cardWrapper: { marginBottom: '8px', userSelect: 'none', borderRadius: '8px' },
  cardDragging: { opacity: 0.85, boxShadow: '0 16px 40px rgba(0,0,0,0.5)' },
  addTaskBtn: { margin: '8px 10px 10px', padding: '8px', background: 'none', border: '1px dashed rgba(190,155,121,0.2)', color: 'rgba(190,155,121,0.5)', cursor: 'pointer', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', fontFamily: 'Georgia, serif' },
  addTaskIcon: { fontSize: '16px', fontWeight: '300' },
};