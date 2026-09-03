const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
    try {
        // 1. Lấy dữ liệu do Client gửi lên trong body của request
        const { fullName, email, password } = req.body;

        // [MỚI BỔ SUNG] 2. Kiểm tra không được để trống
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
        }

        // [MỚI BỔ SUNG] 3. Kiểm tra định dạng Email bằng Regex 
        // Chỉ chấp nhận đuôi .com, .vn, hoặc .edu.vn
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|vn|edu\.vn)$/i;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email không đúng định dạng chuẩn!' });
        }

        // 4. Kiểm tra xem email này đã có ai dùng chưa
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng!' });
        }

        // 5. Băm (hash) mật khẩu
        const saltRounds = 10; // Độ phức tạp của thuật toán băm (càng cao càng an toàn nhưng càng chậm)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 6. Lưu user mới vào Database thông qua Model
        const newUser = await User.createUser(fullName, email, hashedPassword);

        // 7. Trả về kết quả thành công (HTTP Status 201: Created)
        res.status(201).json({
            message: 'Đăng ký tài khoản thành công!',
            user: newUser
        });
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Tìm user trong database bằng email
        const user = await User.findUserByEmail(email);

        // Khám nghiệm 1: Xem DB trả về gì
        console.log("DỮ LIỆU USER LẤY TỪ DB:", user);
        
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }

        // === [MỚI BỔ SUNG] Khám nghiệm 2: Soi xem React gửi mật khẩu gì lên ===
        console.log("Pass gửi lên từ React:", password);

        // 2. So sánh mật khẩu Client gửi lên với mật khẩu đã hash trong Database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }

        // 3. Nếu đúng, tiến hành tạo JWT
        const payload = {
            id: user.id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // 4. Trả về token và thông tin user
        res.status(200).json({
            message: 'Đăng nhập thành công!',
            token: token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

const getMe = async (req, res) => {
    try {
        // Nhờ middleware `verifyToken` đã chạy trước đó, ta có sẵn `req.user`
        // Bây giờ chỉ cần trả thông tin đó về cho Client
        res.status(200).json({
            message: 'Truy cập thông tin cá nhân thành công!',
            user: req.user 
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

module.exports = { register, login, getMe };