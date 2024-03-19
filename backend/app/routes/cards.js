const express = require('express');
const router = express.Router();
const { store, destroy, compare, index } = require('../controllers/card.controller')
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/', authenticateToken, index);
router.post('/', authenticateToken, store);
router.post('/compare', authenticateToken, compare);
router.delete('/', authenticateToken, destroy);

module.exports = router;