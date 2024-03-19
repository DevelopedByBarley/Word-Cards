const express = require('express');
const router = express.Router();
const { store, login, index, logout } = require('../controllers/user.controller')
const authenticateToken = require('../middlewares/authenticateToken');
const upload = require('../middlewares/multer')

router.get('/', authenticateToken, index);
router.post('/register', upload.single('file'), store);
router.post('/login',  login);
router.post('/logout', authenticateToken, logout);

module.exports = router;