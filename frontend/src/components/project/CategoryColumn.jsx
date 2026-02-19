import { useState, useEffect } from 'react';
import axios from 'axios';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import Modal from '../common/Modal'; 
import TaskDetailModal from './TaskDetailModal'; 

// 1. รับ onDeleteCategory เข้ามาด้วย (ไม่งั้นกดลบไม่ได้)
export default function CategoryColumn({ category, onDeleteCategory, dragHandleProps, refreshKey }) {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [newTaskContent, setNewTaskContent] = useState(''); 
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const token = localStorage.getItem('token');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${category._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks(); 
    } catch (err) { alert('ลบ Task ไม่สำเร็จ'); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskContent) return;

    try {
      await axios.post('http://localhost:5000/api/tasks', 
        { title: newTaskContent, categoryId: category._id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewTaskContent('');
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      alert('สร้าง Task ไม่สำเร็จ');
    }
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };
  
  useEffect(() => {
    fetchTasks();
  }, [category._id, refreshKey]);

  return (
    <div style={styles.column}>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task" onSubmit={handleCreateTask}>
        <input placeholder="Task Name..." value={newTaskContent} onChange={(e) => setNewTaskContent(e.target.value)} autoFocus style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ddd' }} />
      </Modal>

      <TaskDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={selectedTask}
        onUpdate={fetchTasks}
        onDelete={handleDeleteTask} // <--- เพิ่มบรรทัดนี้
      />

      <div 
        style={styles.headerRow}
        {...dragHandleProps} 
      >
        <h3 style={styles.header}>{category.name}</h3>
        <button 
          // ใส่ onMouseDown เพื่อกันไม่ให้การกดปุ่มลบ กลายเป็นการลากเสา
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={() => { if(window.confirm(`ลบ Catalog "${category.name}"?`)) onDeleteCategory(category._id); }} 
          style={styles.deleteColBtn}
        >
          ✖
        </button>
      </div>

      <Droppable droppableId={category._id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={styles.taskList}>
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => handleCardClick(task)}
                    style={{ ...styles.cardWrapper, ...provided.draggableProps.style }}
                  >
                    {/* เอาปุ่มลบ (x) ออกจากตรงนี้ก็ได้ครับ ถ้าอยากให้คลีนๆ */}
                    <TaskCard task={task} /> 
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button onClick={() => setIsModalOpen(true)} style={styles.addTaskBtn}>+ Add Task</button>
    </div>
  );
}

const styles = {
  column: { minWidth: '280px', width: '280px', backgroundColor: '#ebecf0', borderRadius: '10px', padding: '10px', marginRight: '15px', display: 'flex', flexDirection: 'column', maxHeight: '100%', position: 'relative' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', cursor: 'grab' },
  header: { margin: 0, paddingLeft: '5px', fontSize: '16px', fontWeight: 'bold', color: '#172b4d' },
  deleteColBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' },
  taskList: { flexGrow: 1, overflowY: 'auto', marginBottom: '10px', paddingRight: '5px' },
  addTaskBtn: { backgroundColor: 'transparent', border: 'none', color: '#5e6c84', padding: '8px', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', fontSize: '14px', marginTop: 'auto', width: '100%' },
  cardWrapper: {
    marginBottom: '10px', 
    userSelect: 'none' 
  }
};