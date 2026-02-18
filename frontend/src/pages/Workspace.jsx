import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/Modal'; // <--- 1. Import Modal มา

export default function Workspace() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- 2. เพิ่ม State สำหรับ Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  // -------------------------------

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchDashboards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboards', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboards(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
      setLoading(false);
    }
  };

  // --- 3. แก้ไขฟังก์ชันสร้าง Dashboard (ไม่ต้องรับ prompt แล้ว) ---
  const handleCreateDashboard = async (e) => {
    e.preventDefault(); // ป้องกันเว็บ Refresh
    if (!newDashboardName) return;

    try {
      await axios.post('http://localhost:5000/api/dashboards', 
        { name: newDashboardName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Reset ค่าและปิด Modal
      setNewDashboardName('');
      setIsModalOpen(false);
      fetchDashboards(); 
    } catch (error) {
      alert('สร้าง Dashboard ไม่สำเร็จ');
    }
  };

  useEffect(() => {
    if (!token) navigate('/auth');
    else fetchDashboards();
  }, [token, navigate]);

  const handleOpenDashboard = (dashboardId) => {
    navigate(`/dashboard/${dashboardId}`); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* --- 4. เรียกใช้ Component Modal --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create New Dashboard"
        onSubmit={handleCreateDashboard}
      >
        <input 
          type="text" 
          placeholder="Dashboard Name (e.g. My Project)" 
          value={newDashboardName}
          onChange={(e) => setNewDashboardName(e.target.value)}
          autoFocus
          style={styles.input}
        />
      </Modal>
      {/* ---------------------------------- */}

      <div style={styles.header}>
        <h2 style={{color: 'white'}}>Workspace ของ {user.user_id}</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.grid}>
        {/* เปลี่ยน onClick ให้เปิด Modal แทน */}
        <div style={styles.newCard} onClick={() => setIsModalOpen(true)}>
          <span style={{fontSize: '40px', marginBottom: '10px'}}>+</span>
          <span>New Dashboard</span>
        </div>

        {dashboards.map((board) => (
          <div key={board._id} style={styles.card} onClick={() => handleOpenDashboard(board._id)}>
            <div style={styles.cardTitle}>{board.name}</div>
            <div style={styles.cardDate}>Created: {new Date(board.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Styles เดิม + เพิ่ม input style
const styles = {
  container: { padding: '40px', backgroundColor: '#9a9a9a', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '20px' },
  newCard: { width: '200px', height: '150px', backgroundColor: '#ccc', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#333', fontWeight: 'bold', border: '2px dashed #666' },
  card: { width: '200px', height: '150px', backgroundColor: 'white', borderRadius: '10px', padding: '15px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  cardTitle: { fontWeight: 'bold', fontSize: '18px', color: '#333' },
  cardDate: { fontSize: '12px', color: '#888', alignSelf: 'flex-end' },
  // เพิ่ม style input ใน modal
  input: { width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ddd' }
};