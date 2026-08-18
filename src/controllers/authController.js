const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
    try {
        // 1. Lấy dữ liệu do Client gửi lên trong body của request
        const { fullName, email, password } = req.body;

        // 2. Kiểm tra xem email này đã có ai dùng chưa
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng!' });
        }

        // 3. Băm (hash) mật khẩu
        const saltRounds = 10; // Độ phức tạp của thuật toán băm (càng cao càng an toàn nhưng càng chậm)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Lưu user mới vào Database thông qua Model
        const newUser = await User.createUser(fullName, email, hashedPassword);

        // 5. Trả về kết quả thành công (HTTP Status 201: Created)
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
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }

        // 2. So sánh mật khẩu Client gửi lên với mật khẩu đã hash trong Database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }

        // 3. Nếu đúng, tiến hành tạo JWT
        // Payload là những thông tin mình muốn nhét vào token (ở đây là id và role)
        const payload = {
            id: user.id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // 4. Trả về token và thông tin user (nhớ loại bỏ password không trả về)
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