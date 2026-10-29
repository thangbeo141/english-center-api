const express = require('express');


// Import thêm getMe
const { register, login, getMe, updateMe } = require('../controllers/authController'); 
// Import middleware
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Định nghĩa API: POST /register
router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.put('/me', verifyToken, updateMe);
module.exports = router;