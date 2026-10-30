const Course = require('../models/courseModel');

// Xử lý tạo khóa học
const addCourse = async (req, res) => {
    const { title, description, price } = req.body;

    if (!title || !price) {
        return res.status(400).json({ message: 'Vui lòng nhập đủ Tên khóa học và Giá tiền!' });
    }

    try {
        const newCourse = await Course.createCourse(title, description, price);
        res.status(201).json({
            message: 'Tạo khóa học thành công',
            data: newCourse
        });
    } catch (error) {
        console.error('Lỗi tạo khóa học:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

// Xử lý lấy danh sách
const getCourses = async (req, res) => {
    try {
        const courses = await Course.getAllCourses();
        res.status(200).json({
            message: 'Lấy danh sách khóa học thành công',
            total: courses.length,
            data: courses
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách khóa học:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};
// lấy danh sách khóa học của giáo viên
const getTeachingCourses = async (req, res) => {
    const teacherId = req.user.id; // Lấy ID giáo viên từ token
    try {
        const courses = await Course.getTeachingCourses(teacherId);
        res.status(200).json({
            message: 'Lấy danh sách khóa học của giáo viên thành công',
            total: courses.length,
            data: courses
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách khóa học của giáo viên:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

// Admin gán giáo viên
const assignTeacherToCourse = async (req, res) => {
    const courseId = Number(req.params.id);
    const { teacherId } = req.body;

    if (!/^\d+$/.test(req.params.id) || !Number.isInteger(courseId) || courseId <= 0) {
        return res.status(400).json({ message: 'ID khóa học không hợp lệ!' });
    }

    if (!Number.isInteger(Number(teacherId)) || Number(teacherId) <= 0) {
        return res.status(400).json({ message: 'ID giáo viên không hợp lệ!' });
    }

    try {
        const assignment = await Course.assignTeacher(courseId, Number(teacherId));
        
        if (!assignment) {
            return res.status(400).json({ message: 'Giáo viên này đã được phân công vào khóa này rồi!' });
        }

        res.status(201).json({ message: 'Gán giáo viên thành công!', data: assignment });
    } catch (error) {
        console.error('Lỗi khi gán giáo viên:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

// Lấy danh sách học viên theo khóa học
const getStudentsByCourse = async (req, res) => {
    const courseId = Number(req.params.id);

    if (!/^\d+$/.test(req.params.id) || !Number.isInteger(courseId) || courseId <= 0) {
        return res.status(400).json({ message: 'ID khóa học không hợp lệ!' });
    }

    try {
        const students = await Course.getStudentsByCourse(courseId, req.user);
        res.status(200).json({
            message: 'Lấy danh sách học viên của khóa học thành công',
            total: students.length,
            data: students
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách học viên của khóa học:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

module.exports = { addCourse, getCourses, assignTeacherToCourse, getTeachingCourses, getStudentsByCourse };