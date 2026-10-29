const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { createAccount, updateAccount } = require('../services/userService');

const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const newUser = await createAccount({ fullName, email, password });

        res.status(201).json({
            message: 'Đăng ký tài khoản thành công!',
            user: newUser
        });
    } catch (error) {
        if (error.code === 'VALIDATION_ERROR' || error.code === 'EMAIL_EXISTS') {
            return res.status(400).json({ message: error.message });
        }
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
        const user = await User.findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }

        res.status(200).json({
            message: 'Truy cập thông tin cá nhân thành công!',
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy hồ sơ:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

const updateMe = async (req, res) => {
    try {
        const { fullName, email, currentPassword, newPassword } = req.body;
        const user = await updateAccount(req.user.id, {
            fullName: fullName?.trim(),
            email: email?.trim().toLowerCase(),
            currentPassword,
            newPassword
        });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }

        res.status(200).json({
            message: 'Cập nhật hồ sơ thành công!',
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        if (error.code === 'USER_NOT_FOUND') {
            return res.status(404).json({ message: error.message });
        }
        if (['VALIDATION_ERROR', 'EMAIL_EXISTS', 'INVALID_PASSWORD'].includes(error.code)) {
            return res.status(error.code === 'INVALID_PASSWORD' ? 401 : 400)
                .json({ message: error.message });
        }
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Email đã được sử dụng!' });
        }
        console.error('Lỗi khi cập nhật hồ sơ:', error);
        res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
};

module.exports = { register, login, getMe, updateMe };