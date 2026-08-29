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

// Admin gán giáo viên
const assignTeacherToCourse = async (req, res) => {
    const courseId = req.params.id; // Lấy ID khóa học từ thanh URL
    const { teacherId } = req.body; // Lấy ID giáo viên từ Body JSON

    if (!teacherId) {
        return res.status(400).json({ message: 'Vui lòng cung cấp ID giáo viên!' });
    }

    try {
        const assignment = await Course.assignTeacher(courseId, teacherId);
        
        if (!assignment) {
            return res.status(400).json({ message: 'Giáo viên này đã được phân công vào khóa này rồi!' });
        }

        res.status(201).json({ message: 'Gán giáo viên thành công!', data: assignment });
    } catch (error) {
        console.error('Lỗi khi gán giáo viên:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};



module.exports = { addCourse, getCourses, assignTeacherToCourse };