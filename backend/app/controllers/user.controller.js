const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { generateAccessToken, generateRefreshToken, token } = require('../helpers/generateToken');
const setCardsForRepeat = require("../helpers/setCardsForRepeat");
const Card = require("../models/card.model");

const store = async (req, res) => {

  // Megtekint mongoos-al hogy a felhasználó létezik-e email cím alapján, ha igen akkor error

  const { userName, email, password, capacity } = req.body;
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name: userName,
      email: email,
      password: hashedPassword,
      capacity: capacity
    });

    await newUser.save();
    return res.status(200).json({
      status: true,
      message: "User created successfully!",
    })
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      status: false,
      message: "User creating fail!",
    })
  }

}

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    setCardsForRepeat(user._id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User doesn't exist in user.controller.login",
      });
    }

    // Ellenőrizzük a jelszót
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: false,
        message: "Wrong e-mail or password!",
      });
    }

    // Ha minden stimmel, generálunk egy refresh token-t és egy access token-t
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Csak HTTPS-en keresztül engedélyezett
      maxAge: 24 * 60 * 60 * 1000 // 1 nap
    });


    res.status(200).json({
      status: true,
      token: accessToken
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }


};

const index = async (req, res) => {
  const { user } = req;

  setCardsForRepeat(user._id);

/*   if (!await checkCapacity(user)) {
    return res.status(500).json({
      status: false,
      message: "You earned your capacity!",
    })
  } */
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User doesn't exist in user.controller.index",
    });
  };

  try {
    let userData = await User.findOne({
      _id: user._id
    }).populate({
      path: 'themes',
      populate: {
        path: 'cards'
      }
    }).exec();

    userData.cardsForRepeat = await Card.find({
      user: user._id,
      repeat: true
    }).exec();
    userData.currentCapacity = await checkCapacity(user)


    if (!userData) {
      return res.status(404).json({
        status: false,
        message: "User data not found in database",
      });
    }





    return res.status(200).json({
      status: true,
      user: userData,
    });
  } catch (error) {
    // Kezeljük a lekérdezés közbeni hibákatű
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Error occurred while fetching user data",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    // Töröljük a refresh token-t a kliens cookie-jából
    res.clearCookie('refreshToken');

    res.status(200).json({
      status: true,
      message: 'User successfully logged out.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


async function checkCapacity(user) {
  // Mai nap kezdetének dátuma (év-hónap-nap 00:00:00 órával)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Mai nap vége dátuma (év-hónap-nap 23:59:59.999 órával)
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Keresés a kártyák között, amelyek a mai napon lettek létrehozva
  const cards = await Card.find({
    user: user._id,
    createdAt: {
      $gte: startOfToday, // Nagyobb vagy egyenlő, mint a mai nap kezdete
      $lte: endOfToday    // Kisebb vagy egyenlő, mint a mai nap vége
    }
  });


  if ((cards.length !== 0) && user.capacity < cards.length) return false;
  return user.capacity - cards.length;
}


module.exports = {
  store,
  login,
  index,
  logout
}