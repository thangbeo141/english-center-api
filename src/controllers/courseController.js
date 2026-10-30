const Course = require('../models/courseModel');
const { successResponse, errorResponse } = require('../utils/response');

// Xử lý tạo khóa học
const addCourse = async (req, res) => {
    const { title, description, price } = req.body;

    if (!title || !price) {
        return errorResponse(res, 400, 'Vui lòng nhập đủ Tên khóa học và Giá tiền!');
    }

    try {
        const newCourse = await Course.createCourse(title, description, price);
        successResponse(res, 201, 'Tạo khóa học thành công', newCourse);
    } catch (error) {
        console.error('Lỗi tạo khóa học:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

// Xử lý lấy danh sách
const getCourses = async (req, res) => {
    try {
        const courses = await Course.getAllCourses();
        successResponse(res, 200, 'Lấy danh sách khóa học thành công', courses, courses.length);
    } catch (error) {
        console.error('Lỗi lấy danh sách khóa học:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};
// lấy danh sách khóa học của giáo viên
const getTeachingCourses = async (req, res) => {
    const teacherId = req.user.id; // Lấy ID giáo viên từ token
    try {
        const courses = await Course.getTeachingCourses(teacherId);
        successResponse(res, 200, 'Lấy danh sách khóa học của giáo viên thành công', courses, courses.length);
    } catch (error) {
        console.error('Lỗi lấy danh sách khóa học của giáo viên:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

// Admin gán giáo viên
const assignTeacherToCourse = async (req, res) => {
    const courseId = Number(req.params.id);
    const { teacherId } = req.body;

    if (!/^\d+$/.test(req.params.id) || !Number.isInteger(courseId) || courseId <= 0) {
        return errorResponse(res, 400, 'ID khóa học không hợp lệ!');
    }

    if (!Number.isInteger(Number(teacherId)) || Number(teacherId) <= 0) {
        return errorResponse(res, 400, 'ID giáo viên không hợp lệ!');
    }

    try {
        const assignment = await Course.assignTeacher(courseId, Number(teacherId));
        
        if (!assignment) {
            return errorResponse(res, 400, 'Giáo viên này đã được phân công vào khóa này rồi!');
        }

        successResponse(res, 201, 'Gán giáo viên thành công!', assignment);
    } catch (error) {
        console.error('Lỗi khi gán giáo viên:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

// Lấy danh sách học viên theo khóa học
const getStudentsByCourse = async (req, res) => {
    const courseId = Number(req.params.id);

    if (!/^\d+$/.test(req.params.id) || !Number.isInteger(courseId) || courseId <= 0) {
        return errorResponse(res, 400, 'ID khóa học không hợp lệ!');
    }

    try {
        const students = await Course.getStudentsByCourse(courseId, req.user);
        successResponse(res, 200, 'Lấy danh sách học viên của khóa học thành công', students, students.length);
    } catch (error) {
        console.error('Lỗi lấy danh sách học viên của khóa học:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

module.exports = { addCourse, getCourses, assignTeacherToCourse, getTeachingCourses, getStudentsByCourse };