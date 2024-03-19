const express = require('express');
const router = express.Router();
const { store, destroy, update } = require('../controllers/theme.controller')
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/', authenticateToken, store);
router.delete('/', authenticateToken, destroy);
router.put('/', authenticateToken, update);

module.exports = router;