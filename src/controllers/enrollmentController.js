const Enrollment = require('../models/enrollmentModel');

// Học viên đăng ký khóa học
const enroll = async (req, res) => {
    // Lấy ID học viên ngầm từ Token (nhờ middleware verifyToken gán vào req.user)
    const studentId = req.user.id; 
    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json({ message: 'Vui lòng cung cấp ID khóa học (courseId)!' });
    }

    try {
        const newEnrollment = await Enrollment.enrollStudent(studentId, courseId);
        
        // Nếu newEnrollment bị undefined (do câu lệnh ON CONFLICT DO NOTHING chặn lại)
        if (!newEnrollment) {
            return res.status(400).json({ message: 'Bạn đã đăng ký khóa học này từ trước rồi!' });
        }

        res.status(201).json({
            message: 'Đăng ký khóa học thành công!',
            data: newEnrollment
        });
    } catch (error) {
        console.error('Lỗi khi ghi danh:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

// Học viên xem danh sách các khóa mình đang học
const getMyCourses = async (req, res) => {
    const studentId = req.user.id; // Vẫn lấy ID an toàn từ Token

    try {
        const courses = await Enrollment.getStudentCourses(studentId);
        res.status(200).json({
            message: 'Lấy danh sách khóa học của bạn thành công',
            total: courses.length,
            data: courses
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách khóa học đang học:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

module.exports = { enroll, getMyCourses };