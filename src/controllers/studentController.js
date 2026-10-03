const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const createStudent = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ họ tên, email và mật khẩu!' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|vn|edu\.vn)$/i;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email không đúng định dạng chuẩn!' });
    }

    try {
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = await User.createUser(fullName, email, hashedPassword, 'student');

        res.status(201).json({
            message: 'Thêm học viên thành công!',
            data: newStudent
        });
    } catch (error) {
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

module.exports = { createStudent, getStudentsList, updateStudent, deleteStudent };