const express = require('express');
const { getStudentsList } = require('../controllers/studentController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Định nghĩa API: GET /api/students
// Giải thích luồng: Có Token không? -> Có phải Admin/Teacher không? -> Lấy danh sách
router.get('/', verifyToken, checkRole(['admin', 'teacher']), getStudentsList);

module.exports = router;