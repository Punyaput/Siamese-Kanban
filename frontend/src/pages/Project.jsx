import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import CategoryColumn from '../components/project/CategoryColumn';
import Modal from '../components/common/Modal';

export default function Project() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [projectName, setProjectName] = useState('Loading...');
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
      setProjectName(`Board ID: ${id.substring(0, 6)}...`);
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
        { name: newCatalogName, projectId: id },
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

    // 1. Reorder Columns (เหมือนเดิม)
    if (type === 'COLUMN') {
      try {
        // เรียก API ย้าย Category ที่เราเพิ่งสร้าง
        await axios.put(`http://localhost:5000/api/categories/move/${draggableId}`, 
          { 
            newOrder: destination.index // ส่งตำแหน่งใหม่ไปให้ Backend จัดการ
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // โหลดข้อมูลโปรเจกต์ใหม่เพื่ออัปเดตหน้าจอ
        setRefreshKey(prev => prev + 1); 
        
      } catch (err) {
        console.error(err);
        alert('ย้ายคอลัมน์ไม่สำเร็จ');
      }
      return; // ใส่ return ตรงนี้เพื่อจบการทำงาน ไม่ให้ไหลไปโดนโค้ดย้าย Task ข้างล่าง
    }

    // 2. Move Task (แก้ตรงนี้!)
    try {
      // เรียก API ตัวใหม่ /api/tasks/move/:id
      await axios.put(`http://localhost:5000/api/tasks/move/${draggableId}`, 
        { 
          categoryId: destination.droppableId, // Category ปลายทาง
          newOrder: destination.index          // ลำดับใหม่ (Backend จะเอาไป Shift ให้เอง)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // สั่งให้โหลดข้อมูลใหม่ทันที
      setRefreshKey(prev => prev + 1); 

    } catch (err) { 
      console.error(err);
      alert('ย้ายงานไม่สำเร็จ'); 
    }
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
          <h2 style={{color: 'white', margin: 0}}>{projectName}</h2>
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