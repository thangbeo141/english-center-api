const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { createAccount, updateAccount } = require('../services/userService');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const newUser = await createAccount({ fullName, email, password });

        successResponse(res, 201, 'Đăng ký tài khoản thành công!', newUser);
    } catch (error) {
        if (error.code === 'VALIDATION_ERROR' || error.code === 'EMAIL_EXISTS') {
            return errorResponse(res, 400, error.message);
        }
        console.error('Lỗi khi đăng ký:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Tìm user trong database bằng email
        const user = await User.findUserByEmail(email);

        if (!user) {
            return errorResponse(res, 401, 'Email hoặc mật khẩu không đúng!');
        }

        // 2. So sánh mật khẩu Client gửi lên với mật khẩu đã hash trong Database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, 401, 'Email hoặc mật khẩu không đúng!');
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
        successResponse(res, 200, 'Đăng nhập thành công!', {
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findUserById(req.user.id);
        if (!user) {
            return errorResponse(res, 404, 'Không tìm thấy người dùng!');
        }

        successResponse(res, 200, 'Truy cập thông tin cá nhân thành công!', {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role,
                createdAt: user.created_at
        });
    } catch (error) {
        console.error('Lỗi khi lấy hồ sơ:', error);
        errorResponse(res, 500, 'Lỗi server');
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
            return errorResponse(res, 404, 'Không tìm thấy người dùng!');
        }

        successResponse(res, 200, 'Cập nhật hồ sơ thành công!', {
                id: user.id,
                fullName: user.full_name,
                email: user.email,
                role: user.role,
                createdAt: user.created_at
        });
    } catch (error) {
        if (error.code === 'USER_NOT_FOUND') {
            return errorResponse(res, 404, error.message);
        }
        if (['VALIDATION_ERROR', 'EMAIL_EXISTS', 'INVALID_PASSWORD'].includes(error.code)) {
            return errorResponse(res, error.code === 'INVALID_PASSWORD' ? 401 : 400, error.message);
        }
        if (error.code === '23505') {
            return errorResponse(res, 400, 'Email đã được sử dụng!');
        }
        console.error('Lỗi khi cập nhật hồ sơ:', error);
        errorResponse(res, 500, 'Lỗi server nội bộ');
    }
};

module.exports = { register, login, getMe, updateMe };