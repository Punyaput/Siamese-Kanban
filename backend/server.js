const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173' // Set this to your Vercel URL in Render settings
}));
app.use(express.json({ limit: '10kb' }));

// เรียกใช้ Route ที่เราเพิ่งสร้างใน ./routes/auth.js
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const categoryRoutes = require('./routes/categories');
const taskRoutes = require('./routes/tasks');
const logRoutes = require('./routes/logs');
app.use('/api/logs', logRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tasks', taskRoutes);

// --- ส่วนที่เพิ่มเข้ามา: เชื่อมต่อ MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB (Siamese Kanban Database)'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('Siamese Kanban Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});