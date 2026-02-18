import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import CategoryColumn from '../components/dashboard/CategoryColumn';
import Modal from '../components/common/Modal';

export default function Dashboard() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [dashboardName, setDashboardName] = useState('Loading...');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatalogName, setNewCatalogName] = useState('');
  const token = localStorage.getItem('token');
  
  // ใช้ refreshKey เพื่อบังคับให้ Component ลูกโหลดข้อมูลใหม่
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
      setDashboardName(`Board ID: ${id.substring(0, 6)}...`);
    } catch (err) { console.error(err); }
  };

  const handleDeleteCategory = async (catId) => {
    try {
      await axios.delete(`http://localhost:5000/api/categories/${catId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
    } catch (err) { alert('ลบไม่สำเร็จ'); }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatalogName) return;
    try {
      await axios.post('http://localhost:5000/api/categories', 
        { name: newCatalogName, dashboardId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCatalogName('');
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) { alert('สร้าง Catalog ไม่สำเร็จ'); }
  };

  useEffect(() => {
    fetchCategories();
  }, [id, refreshKey]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // 1. ย้ายเสา (Column)
    if (type === 'COLUMN') {
      const newCategories = Array.from(categories);
      const [removed] = newCategories.splice(source.index, 1);
      newCategories.splice(destination.index, 0, removed);
      
      setCategories(newCategories); // อัปเดต UI ทันที

      const newOrderIds = newCategories.map(cat => cat._id);
      try {
        await axios.put('http://localhost:5000/api/categories/reorder', 
          { newOrderIds },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) { console.error('Reorder failed'); }
      return;
    }

    // 2. ย้ายงาน (Task)
    try {
      await axios.put(`http://localhost:5000/api/tasks/${draggableId}`, 
        { categoryId: destination.droppableId, order: destination.index },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefreshKey(prev => prev + 1); // สั่งโหลดใหม่
    } catch (err) { alert('ย้ายงานไม่สำเร็จ'); }
  };

  return (
    <div style={styles.container}>
      <DragDropContext onDragEnd={onDragEnd}>
        
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Catalog" onSubmit={handleCreateCategory}>
          <input 
            type="text" 
            placeholder="Catalog Name..." 
            value={newCatalogName} 
            onChange={(e) => setNewCatalogName(e.target.value)} 
            autoFocus 
            style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ddd' }} 
          />
        </Modal>

        <div style={styles.header}>
          <h2 style={{color: 'white', margin: 0}}>{dashboardName}</h2>
        </div>

        {/* Container หลักสำหรับพื้นที่ Board */}
        <div style={styles.boardCanvas}>
          
          {/* พื้นที่ Drag & Drop สำหรับเสา */}
          <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
            {(provided) => (
              <div 
                style={styles.columnsContainer} // แยก style ออกมา
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

          {/* *** ย้ายปุ่ม + New Catalog ออกมาอยู่นอก Droppable *** */}
          <div onClick={() => setIsModalOpen(true)} style={styles.newColumnBtn}>
            + New Catalog
          </div>

        </div>

      </DragDropContext>
    </div>
  );
}

const styles = {
  container: { 
    height: 'calc(100vh - 60px)', 
    display: 'flex', 
    flexDirection: 'column', 
    backgroundColor: '#9a9a9a', 
    padding: '20px' 
  },
  header: { marginBottom: '20px' },
  boardCanvas: { 
    display: 'flex', 
    overflowX: 'auto', 
    height: '100%', 
    alignItems: 'flex-start' 
  },
  columnsContainer: {
    display: 'flex',
    height: '100%'
  },
  columnWrapper: { 
    marginRight: '15px' 
  },
  newColumnBtn: { 
    minWidth: '280px', 
    height: '50px', 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: '10px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    color: 'white', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    border: '2px dashed rgba(255,255,255,0.5)', 
    // ไม่ต้องมี marginTop แล้ว เพราะมันจะเรียงต่อกันเองใน flex
    flexShrink: 0 // ป้องกันปุ่มหดตัว
  }
};