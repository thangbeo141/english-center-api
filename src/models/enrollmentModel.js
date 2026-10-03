const pool = require('../config/database');

// Học viên đăng ký vào một khóa học
const enrollStudent = async (studentId, courseId) => {
    // Dùng ON CONFLICT để tránh lỗi sập server nếu học viên ấn đăng ký 2 lần
    const result = await pool.query(
        `INSERT INTO enrollments (user_id, course_id) 
         VALUES ($1, $2) 
         ON CONFLICT (user_id, course_id) DO NOTHING 
         RETURNING *`,//giúp bạn lấy ngay được dòng dữ liệu vừa thêm vào
        [studentId, courseId]
    );
    return result.rows[0];
};

// Xem danh sách các khóa học mà 1 học viên đã đăng ký (Dùng JOIN 2 bảng)
const getStudentCourses = async (studentId) => {
    const result = await pool.query(
        `SELECT c.id, c.title, c.description, e.enrolled_at 
         FROM enrollments e
         JOIN courses c ON e.course_id = c.id
         WHERE e.user_id = $1`,
        [studentId]
    );
    return result.rows;
};

module.exports = { enrollStudent, getStudentCourses };