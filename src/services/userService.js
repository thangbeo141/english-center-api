const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|vn|edu\.vn)$/i;

const createAccount = async ({ fullName, email, password, role = 'student' }) => {
    if (!fullName || !email || !password) {
        const error = new Error('Vui lòng điền đầy đủ thông tin!');
        error.code = 'VALIDATION_ERROR';
        throw error;
    }

    if (!emailRegex.test(email)) {
        const error = new Error('Email không đúng định dạng chuẩn!');
        error.code = 'VALIDATION_ERROR';
        throw error;
    }

    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
        const error = new Error('Email đã được sử dụng!');
        error.code = 'EMAIL_EXISTS';
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return User.createUser(fullName, email, hashedPassword, role);
};

const updateAccount = async (id, { fullName, email, currentPassword, newPassword }) => {
    if (!fullName || !email) {
        const error = new Error('Họ tên và email là bắt buộc!');
        error.code = 'VALIDATION_ERROR';
        throw error;
    }

    if (!emailRegex.test(email)) {
        const error = new Error('Email không đúng định dạng chuẩn!');
        error.code = 'VALIDATION_ERROR';
        throw error;
    }

    const user = await User.findUserByEmail(email);
    if (user && String(user.id) !== String(id)) {
        const error = new Error('Email đã được sử dụng!');
        error.code = 'EMAIL_EXISTS';
        throw error;
    }

    let hashedPassword;
    if (newPassword) {
        if (!currentPassword) {
            const error = new Error('Vui lòng nhập mật khẩu hiện tại!');
            error.code = 'VALIDATION_ERROR';
            throw error;
        }

        const currentUser = await User.findUserById(id);
        if (!currentUser) {
            const error = new Error('Không tìm thấy người dùng!');
            error.code = 'USER_NOT_FOUND';
            throw error;
        }

        const isMatch = await bcrypt.compare(currentPassword, currentUser.password);
        if (!isMatch) {
            const error = new Error('Mật khẩu hiện tại không đúng!');
            error.code = 'INVALID_PASSWORD';
            throw error;
        }

        if (newPassword.length < 6) {
            const error = new Error('Mật khẩu mới phải có ít nhất 6 ký tự!');
            error.code = 'VALIDATION_ERROR';
            throw error;
        }
        hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    return User.updateProfile(id, { fullName, email, password: hashedPassword });
};

module.exports = { createAccount, updateAccount };
