const { Pool } = require('pg');
require('dotenv').config();

// Khởi tạo một Connection Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Bắt sự kiện khi kết nối thành công để log ra console
pool.on('connect', () => {
    console.log('Database connection established successfully!');
});

// Bắt lỗi nếu có vấn đề về kết nối trong quá trình server đang chạy
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1); // Dừng server nếu database sập
});

// Export pool để các file khác (như Models) có thể sử dụng để query
module.exports = pool;