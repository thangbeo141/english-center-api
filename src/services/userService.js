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

module.exports = { createAccount };
