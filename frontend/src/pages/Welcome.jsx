import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Siamese Kanban</h1>
      <p>A website that will let you plan your work personally</p>
      {/* กดปุ่มนี้แล้วไปหน้า Login/Register */}
      <Link to="/auth"><button>Let's start</button></Link>
    </div>
  );
}