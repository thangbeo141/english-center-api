const pool = require('../config/database');

// Thêm khóa học mới
const createCourse = async (title, description, price) => {
    const result = await pool.query(
        "INSERT INTO courses (title, description, price) VALUES ($1, $2, $3) RETURNING *",
        [title, description, price]
    );
    return result.rows[0];
};

// Lấy danh sách toàn bộ khóa học
const getAllCourses = async () => {
    const result = await pool.query("SELECT * FROM courses ORDER BY created_at DESC");
    return result.rows;
};

// Gán giáo viên cho khóa học
const assignTeacher = async (courseId, teacherId) => {
    const result = await pool.query(
        `INSERT INTO course_teachers (course_id, teacher_id) 
         VALUES ($1, $2) 
         ON CONFLICT (course_id, teacher_id) DO NOTHING 
         RETURNING *`,
        [courseId, teacherId]
    );
    return result.rows[0];
};

module.exports = { createCourse, getAllCourses, assignTeacher };