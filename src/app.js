const express = require('express');
const cors = require('cors');

// Khởi tạo app Express
const app = express();

// Middlewares
app.use(cors()); // Cho phép Frontend (React) gọi API mà không bị chặn lỗi CORS
app.use(express.json()); // Giúp app đọc được data gửi lên dưới dạng JSON trong body request

// === THÊM 2 DÒNG NÀY VÀO ===
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // Tiền tố chung cho các API liên quan đến auth


const studentRoutes = require('./routes/studentRoutes');
app.use('/api/students', studentRoutes);

const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);

const enrollmentRoutes = require('./routes/enrollmentRoutes');
app.use('/api/enrollments', enrollmentRoutes); 

// Health Check API
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'English Center API is running!'
    });
});

app.get('/', (req, res) => {
    res.send('Hệ thống CD hoạt động mượt mà 100%!');
});
// Export app để server.js sử dụng
module.exports = app;