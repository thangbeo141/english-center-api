const express = require('express');
const { createStudent, getStudentsList, updateStudent, deleteStudent } = require('../controllers/studentController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Định nghĩa API: GET /api/students
// Giải thích luồng: Có Token không? -> Có phải Admin/Teacher không? -> Lấy danh sách
router.get('/', verifyToken, checkRole(['admin', 'teacher']), getStudentsList);

// Tạo học viên mới (chỉ Admin mới có quyền thêm)
router.post('/', verifyToken, checkRole(['admin']), createStudent);

// API MỚI: Cập nhật thông tin học viên (chỉ Admin mới có quyền sửa)
router.put('/:id', verifyToken, checkRole(['admin']), updateStudent);

// API mới : Xóa học viên (chỉ Admin mới có quyền xóa)
router.delete('/:id', verifyToken, checkRole(['admin']), deleteStudent);

module.exports = router;