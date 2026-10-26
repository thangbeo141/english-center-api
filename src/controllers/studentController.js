const User = require('../models/userModel');
const { createAccount } = require('../services/userService');

const createStudent = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const newStudent = await createAccount({ fullName, email, password, role: 'student' });

        res.status(201).json({
            message: 'Thêm học viên thành công!',
            data: newStudent
        });
    } catch (error) {
        if (error.code === 'VALIDATION_ERROR' || error.code === 'EMAIL_EXISTS') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Lỗi khi thêm học viên:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

const getStudentsList = async (req, res) => {
    try {
        const students = await User.getAllStudents();
        res.status(200).json({
            message: 'Lấy danh sách học viên thành công',
            total: students.length,
            data: students
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách học viên:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

const getTeachersList = async (req, res) => {
    try {
        const teachers = await User.getAllTeachers();
        res.status(200).json({
            message: 'Lấy danh sách giáo viên thành công',
            total: teachers.length,
            data: teachers
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách giáo viên:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

const updateStudent = async (req, res) => {
    // Lấy ID từ URL (ví dụ: /api/students/1 thì params.id là 1)
    const studentId = req.params.id; 
    // Lấy tên mới từ Body Client gửi lên
    const { fullName } = req.body;

    // Validate cơ bản
    if (!fullName) {
        return res.status(400).json({ message: 'Vui lòng cung cấp tên mới (fullName)!' });
    }

    try {
        const updatedUser = await User.updateStudentName(studentId, fullName);
        
        // Nếu updatedUser bị undefined (do ID không tồn tại hoặc người đó không phải student)
        if (!updatedUser) {
            return res.status(404).json({ message: 'Không tìm thấy học viên hoặc tài khoản này không phải học viên!' });
        }

        res.status(200).json({
            message: 'Cập nhật thông tin thành công',
            data: updatedUser
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật học viên:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

const deleteStudent = async (req, res) => {
    const studentId = req.params.id;

    try {
        const isDeleted = await User.deleteStudent(studentId);
        
        if (!isDeleted) {
            return res.status(404).json({ 
                message: 'Không tìm thấy học viên hoặc tài khoản này không phải học viên!' 
            });
        }

        res.status(200).json({
            message: 'Đã xóa học viên thành công!'
        });
    } catch (error) {
        console.error('Lỗi khi xóa học viên:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

module.exports = { createStudent, getStudentsList, getTeachersList, updateStudent, deleteStudent };