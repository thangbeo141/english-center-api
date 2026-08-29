const express = require('express');
const { enroll, getMyCourses } = require('../controllers/enrollmentController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Lấy danh sách khóa học của TÔI (Chỉ Student)
router.get('/my-courses', verifyToken, checkRole(['student']), getMyCourses);

// Đăng ký khóa học mới (Chỉ Student)
router.post('/', verifyToken, checkRole(['student']), enroll);

module.exports = router;