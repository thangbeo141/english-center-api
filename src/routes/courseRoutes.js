const express = require('express');
const { addCourse, getCourses,assignTeacherToCourse,get} = require('../controllers/courseController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Lấy danh sách (Ai có Token hợp lệ đều xem được)
router.get('/', verifyToken, getCourses);

// Tạo khóa học (Bắt buộc phải là Admin)
router.post('/', verifyToken, checkRole(['admin']), addCourse);

// Gán giáo viên cho khóa học (Bắt buộc phải là Admin)
router.post('/:id/assign-teacher', verifyToken, checkRole(['admin']), assignTeacherToCourse);

//API cho GIáo viên xem lịch dạy
router.get('/teaching', verifyToken, checkRole(['teacher']),getTeachingCourses); 

module.exports = router;