const jwt = require('jsonwebtoken');

function generateAccessToken(userId) {
  return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

function generateRefreshToken(userId) {
  return jwt.sign({ userId: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3h' });
}

const token = async (req, res) => {
  try {
    let refreshToken;
    const cookie = req.headers.cookie;
    if (cookie) {
      refreshToken = req.headers.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('refreshToken='))
        ?.split('=')[1];
    }

    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken(data.userId);
      res.json({ accessToken: accessToken });
    });
  } catch (error) {
    console.error('Error occurred in token handler', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
    });
  }
};


module.exports = {
  generateAccessToken,
  generateRefreshToken,
  token
}