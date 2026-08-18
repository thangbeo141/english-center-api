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

module.exports = { findUserByEmail, createUser };