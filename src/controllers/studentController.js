const User = require('../models/userModel');

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

module.exports = { getStudentsList };