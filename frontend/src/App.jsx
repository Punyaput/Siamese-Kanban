import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Workspace from './pages/Workspace';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar วางไว้นอก Routes เพื่อให้แสดงอยู่ทุกหน้า */}
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;