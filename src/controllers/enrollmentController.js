const Enrollment = require('../models/enrollmentModel');
const { successResponse, errorResponse } = require('../utils/response');

// Học viên đăng ký khóa học
const enroll = async (req, res) => {
    // Lấy ID học viên ngầm từ Token (nhờ middleware verifyToken gán vào req.user)
    const studentId = req.user.id; 
    const { courseId } = req.body;

    const parsedCourseId = Number(courseId);

    if (!Number.isInteger(parsedCourseId) || parsedCourseId <= 0) {
        return errorResponse(res, 400, 'ID khóa học không hợp lệ!');
    }

    try {
        if (!(await Enrollment.courseExists(parsedCourseId))) {
            return errorResponse(res, 404, 'Không tìm thấy khóa học!');
        }

        const newEnrollment = await Enrollment.enrollStudent(studentId, parsedCourseId);
        
        // Nếu newEnrollment bị undefined (do câu lệnh ON CONFLICT DO NOTHING chặn lại)
        if (!newEnrollment) {
            return errorResponse(res, 400, 'Bạn đã đăng ký khóa học này từ trước rồi!');
        }

        successResponse(res, 201, 'Đăng ký khóa học thành công!', newEnrollment);
    } catch (error) {
        console.error('Lỗi khi ghi danh:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

// Học viên xem danh sách các khóa mình đang học
const getMyCourses = async (req, res) => {
    const studentId = req.user.id; // Vẫn lấy ID an toàn từ Token

    try {
        const courses = await Enrollment.getStudentCourses(studentId);
        successResponse(res, 200, 'Lấy danh sách khóa học của bạn thành công', courses, courses.length);
    } catch (error) {
        console.error('Lỗi lấy danh sách khóa học đang học:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

module.exports = { enroll, getMyCourses };