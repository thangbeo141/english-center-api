const pool = require('../config/database');

// Hàm tìm user dựa vào email
const findUserByEmail = async (email) => {
    // $1 là biến truyền vào, giúp chống lỗi bảo mật SQL Injection
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0]; // Trả về user đầu tiên tìm thấy, nếu không có sẽ trả về undefined
};

// Hàm thêm user mới
const createUser = async (fullName, email, hashedPassword, role = 'student') => {
    const result = await pool.query(
        'INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role, created_at',
        [fullName, email, hashedPassword, role]
    );
    return result.rows[0]; // Trả về thông tin user vừa được tạo (không trả về password)
};

// Hàm lấy danh sách tất cả học viên
const getAllStudents = async () => {
    // Không lấy cột password ra để bảo mật
    const result = await pool.query(
        "SELECT id, full_name, email, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC"
    );
    return result.rows;
};

// Lấy danh sách Giáo viên
const getAllTeachers = async () => {
    const result = await pool.query(
        "SELECT id, full_name, email, created_at FROM users WHERE role = 'teacher' ORDER BY created_at DESC"
    );
    return result.rows;
};

// Cập nhật thông tin học viên (hiện tại cho phép sửa Tên)
const updateStudentName = async (id, fullName) => {
    // Lưu ý: Thêm điều kiện role = 'student' để tránh việc Admin lỡ tay sửa nhầm tên của Admin khác
    // Mệnh đề RETURNING giúp trả về luôn dữ liệu vừa được update xong
    const result = await pool.query(
        "UPDATE users SET full_name = $1 WHERE id = $2 AND role = 'student' RETURNING id, full_name, email, role",
        [fullName, id]
    );
    return result.rows[0]; 
};
// Hàm xóa học viên
const deleteStudent = async (id) => {
    // Chỉ xóa nếu ID đó tồn tại và đang là học viên
    const result = await pool.query(
        "DELETE FROM users WHERE id = $1 AND role = 'student' RETURNING id",
        [id]
    );
    // Nếu rowCount > 0 tức là đã xóa thành công ít nhất 1 dòng
    return result.rowCount > 0; 
    
};
module.exports = { findUserByEmail, createUser, getAllStudents, getAllTeachers, updateStudentName , deleteStudent };