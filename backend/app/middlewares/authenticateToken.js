const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']; // Ki szedjük header alól az authorization kulcsot,
  const token = authHeader && authHeader.split(' ')[1]; // spliteljük és az első indexü értéket kérjük ki

  if (!token) { // Ha hiányzik
    return res.status(401).json({
      status: 'fail',
      message: 'Hiányzó token. Kérjük, jelentkezzen be a folytatáshoz.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Megpróbáljuk dekódolni
    req.user = await User.findById(decoded.userId); // És tovább dobjuk ha találtuk
    next(); // Tovább
  } catch (err) {
    return res.status(403).json({
      status: 'fail',
      message: 'Érvénytelen token. Kérjük, jelentkezzen be újra.',
    });
  }
};

module.exports = authenticateToken;
