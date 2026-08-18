require('dotenv').config(); // Load các biến môi trường từ file .env
const app = require('./app');
const pool = require('./config/database');

// Ưu tiên lấy PORT từ file .env, nếu không có thì mặc định là 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Đoạn test kết nối
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Error connecting to PostgreSQL:', err.message);
        } else {
            console.log('PostgreSQL connected at:', res.rows[0].now);
        }
    });    
});