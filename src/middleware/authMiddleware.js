const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    // 1. Lấy token từ header 'Authorization' của request
    const authHeader = req.header('Authorization');
    
    // Quy chuẩn token thường có dạng: "Bearer <chuỗi_token>"
    const token = authHeader && authHeader.split(' ')[1]; 

    // 2. Nếu không có token gửi lên -> Chặn lại
    if (!token) {
        return res.status(401).json({ message: 'Không tìm thấy token, từ chối truy cập!' });
    }

    try {
        // 3. Dùng Secret Key để giải mã và xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Gắn thông tin giải mã được (chứa id, role) vào request để Controller phía sau dùng
        req.user = decoded; 
        
        // 5. Cho phép đi tiếp đến hàm tiếp theo (Controller)
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
    }
};

// Middleware kiểm tra quyền truy cập
const checkRole = (roles) => {
    return (req, res, next) => {
        // req.user đã được tạo ra từ middleware verifyToken chạy trước đó
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'Bạn không có quyền thực hiện hành động này!' 
            });
        }
        next(); // Nếu đúng role thì cho phép đi qua
    };
};

module.exports = { verifyToken, checkRole };