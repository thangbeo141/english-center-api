-- 1. Bảng Users (Lưu thông tin tài khoản)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Courses (Lưu danh sách khóa học)
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng Enrollments (Học viên ghi danh vào khóa học)
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Tránh 1 học viên ghi danh 1 khóa nhiều lần
    UNIQUE(user_id, course_id) 
);

-- 4. Bảng Course_Teachers (Gán giáo viên vào khóa học - Bảng vừa tạo hôm nay)
CREATE TABLE course_teachers (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id INT REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Tránh gán 1 giáo viên 2 lần vào cùng 1 khóa
    UNIQUE(course_id, teacher_id) 
);


