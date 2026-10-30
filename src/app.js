const express = require('express');
const cors = require('cors');
const { successResponse, errorResponse } = require('./utils/response');

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
    successResponse(res, 200, 'English Center API is running!', null);
});

app.get('/', (req, res) => {
    successResponse(res, 200, 'Hệ thống CD hoạt động mượt mà 100%!', null);
});

app.use((req, res) => {
    errorResponse(res, 404, 'Không tìm thấy API yêu cầu!');
});

app.use((error, req, res, next) => {
    console.error('Lỗi không xử lý được:', error);
    errorResponse(res, 500, 'Lỗi server nội bộ');
});
// Export app để server.js sử dụng
module.exports = app;