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

// Lấy danh sách khóa học mà giáo viên đang dạy
const getTeachingCourses = async (teacherId) => {
    const result = await pool.query(
        `SELECT c.* FROM courses c
         JOIN course_teachers ct ON c.id = ct.course_id
         WHERE ct.teacher_id = $1`,
        [teacherId]
    );
    return result.rows;
};

// Lấy danh sách học viên theo khóa học.
// Giáo viên chỉ được xem các khóa mà mình đã được phân công.
const getStudentsByCourse = async (courseId, viewer) => {
    const values = [courseId];
    let teacherFilter = '';

    if (viewer.role === 'teacher') {
        values.push(viewer.id);
        teacherFilter = `
            JOIN course_teachers ct
                ON ct.course_id = e.course_id
               AND ct.teacher_id = $2
        `;
    }

    const query = `
        SELECT u.id, u.full_name AS name, u.email
        FROM users u
        JOIN enrollments e ON u.id = e.user_id
        ${teacherFilter}
        WHERE e.course_id = $1
        ORDER BY u.full_name ASC
    `;
    const result = await pool.query(query, values);
    return result.rows;
};

module.exports = { createCourse, getAllCourses, assignTeacher, getTeachingCourses, getStudentsByCourse };