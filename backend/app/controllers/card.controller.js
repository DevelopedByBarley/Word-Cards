const expires = require("../helpers/cardExpires");
const Card = require("../models/card.model");
const Theme = require("../models/theme.model");
const User = require("../models/user.model");

const index = async (req, res) => {
  const { user } = req;

  try {
    const cards = await Card.find({
      user: user._id
    })

    return res.status(200).json({
      status: true,
      message: "Get cards successfully!",
      data: cards
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: true,
      message: "Cards get fail!",
    });
  }
}

const store = async (req, res) => {
  const { user } = req;
  const { word, translate, sentence, lang, theme } = req.body;

  try {
    const newCard = new Card({
      word: word.toLowerCase(),
      translate: translate.toLowerCase(),
      sentence: replaceWordInSentence(word.toLowerCase(), sentence.toLowerCase()),
      expires: Date.now() + (24 * 60 * 60 * 1000), // Az aktuális időpont + 1 nap
      user: req.user._id,
      theme: theme,
      lang: lang,
    });

    const savedCard = await newCard.save();

    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { cards: savedCard._id } }
    );

    await Theme.findOneAndUpdate(
      { _id: theme }, // needs card id!
      { $push: { cards: savedCard._id } }
    );

    return res.status(200).json({
      status: true,
      message: "Card created successfully!",
      data: savedCard
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong when the card is stored",
    });
  }

}

const update = async (req, res) => {
  const { word, translate, sentence, lang, cardId, themeId } = req.body;
  try {


    const newCard = await Card.findByIdAndUpdate({ _id: cardId }, {
      word: word.toLowerCase(),
      translate: translate.toLowerCase(),
      sentence: replaceWordInSentence(word.toLowerCase(), sentence.toLowerCase()),
      theme: themeId,
      lang: lang,
    });

    res.status(200).json({
      status: true,
      message: "Card updated successfully!",
      data: cardId
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Card updating error!",
    })
  }
}

const destroy = async (req, res) => {
  const { cardId, themeId } = req.body

  try {
    await Card.deleteOne({
      _id: cardId
    })

    await Theme.findOneAndUpdate(
      { _id: themeId },
      { $pull: { cards: cardId } }
    );

    res.status(200).json({
      status: true,
      message: "Card deleted successfully!",
      data: cardId
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Card deleting error!",
    })
  }
}

const compare = async (req, res) => {
  const { translate, cardId } = req.body;
  const card = await Card.findOne({
    _id: cardId
  })

  if (translate.toLowerCase() !== card.translate) {
    return res.status(500).json({
      status: false,
      message: "Card compare error!",
    })
  }

  if (parseInt(card.state) === 6) {
    return res.status(500).json({
      status: false,
      message: "You learned this card!",
    })
  }

  const newState = parseInt(card.state) + 1
  const expiresDate = expires(newState, card.expires);

  const updated = await Card.findOneAndUpdate({ _id: cardId }, {
    state: newState,
    expires: expiresDate,
    repeat: false,
  }, { new: true })

  return res.status(500).json({
    status: true,
    message: "Card compared successfully!",
    card: updated
  })
}

function replaceWordInSentence(word, sentence) {
  var replacement = "_".repeat(word.length);
  return sentence.replace(word, replacement);
}









module.exports = { store, destroy, compare, index, update };