import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome'; // <--- 1. อย่าลืม Import บรรทัดนี้
import Auth from './pages/Auth';
import Workspace from './pages/Workspace';
import Project from './pages/Project';
import Profile from './pages/Profile';
import Navbar from './components/common/Navbar';

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Navbar />
        
        <Routes>
          {/* 2. เปลี่ยนหน้าแรก (Root) ให้เป็น Welcome */}
          <Route path="/" element={<Welcome />} />
          
          <Route path="/auth" element={<Auth />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;