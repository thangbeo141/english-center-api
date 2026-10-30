const User = require('../models/userModel');
const { createAccount } = require('../services/userService');
const { successResponse, errorResponse } = require('../utils/response');

const createStudent = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const newStudent = await createAccount({ fullName, email, password, role: 'student' });

        successResponse(res, 201, 'Thêm học viên thành công!', newStudent);
    } catch (error) {
        if (error.code === 'VALIDATION_ERROR' || error.code === 'EMAIL_EXISTS') {
            return errorResponse(res, 400, error.message);
        }
        console.error('Lỗi khi thêm học viên:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

const getStudentsList = async (req, res) => {
    try {
        const students = await User.getAllStudents();
        successResponse(res, 200, 'Lấy danh sách học viên thành công', students, students.length);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách học viên:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

const getTeachersList = async (req, res) => {
    try {
        const teachers = await User.getAllTeachers();
        successResponse(res, 200, 'Lấy danh sách giáo viên thành công', teachers, teachers.length);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách giáo viên:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

const updateStudent = async (req, res) => {
    // Lấy ID từ URL (ví dụ: /api/students/1 thì params.id là 1)
    const studentId = req.params.id; 
    // Lấy tên mới từ Body Client gửi lên
    const { fullName } = req.body;

    // Validate cơ bản
    if (!fullName) {
        return errorResponse(res, 400, 'Vui lòng cung cấp tên mới (fullName)!');
    }

    try {
        const updatedUser = await User.updateStudentName(studentId, fullName);
        
        // Nếu updatedUser bị undefined (do ID không tồn tại hoặc người đó không phải student)
        if (!updatedUser) {
            return errorResponse(res, 404, 'Không tìm thấy học viên hoặc tài khoản này không phải học viên!');
        }

        successResponse(res, 200, 'Cập nhật thông tin thành công', updatedUser);
    } catch (error) {
        console.error('Lỗi khi cập nhật học viên:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

const deleteStudent = async (req, res) => {
    const studentId = req.params.id;

    try {
        const isDeleted = await User.deleteStudent(studentId);
        
        if (!isDeleted) {
            return errorResponse(res, 404, 'Không tìm thấy học viên hoặc tài khoản này không phải học viên!');
        }

        successResponse(res, 200, 'Đã xóa học viên thành công!', null);
    } catch (error) {
        console.error('Lỗi khi xóa học viên:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

module.exports = { createStudent, getStudentsList, getTeachersList, updateStudent, deleteStudent };