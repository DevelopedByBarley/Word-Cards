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
      sentence: replaceWordInSentence(translate.toLowerCase(), sentence.toLowerCase()),
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
      card: savedCard
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
      sentence: replaceWordInSentence(translate.toLowerCase(), sentence.toLowerCase()),
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
  try {

    const { cardId } = req.params;

    // Keresd meg a Theme-et, amelynek a cards tömbje tartalmazza a kártyát
    const theme = await Theme.findOne({ cards: cardId });


    // Ellenőrizd, hogy találtál-e megfelelő Theme-et
    if (theme) {
      // Töröld a kártyát
      await Card.deleteOne({ _id: cardId });

      // Frissítsd a Theme-et, hogy eltávolítsd belőle a kártyát
      await Theme.findOneAndUpdate(
        { _id: theme._id },
        { $pull: { cards: cardId } }
      );

      // Küldj választ a kliensnek, hogy sikeres volt-e a törlés
      res.status(200).json({
        status: true,
        message: "Card deleted successfully!",
        cardId: cardId
      });
    } else {
      // Ha nem találtál megfelelő Theme-et, küldj hibát a kliensnek
      res.status(404).json({
        status: false,
        message: "Theme not found for the given cardId"
      });
    }
  } catch (error) {
    // Hibakezelés
    console.error("Card deleting error:", error);
    res.status(500).json({
      status: false,
      message: "Card deleting error!"
    });
  }
};



const compare = async (req, res) => {
  const { translate, cardId } = req.body;
  const card = await Card.findOne({
    _id: cardId
  })

  if (translate.toLowerCase() !== card.translate) {
    await Card.findOneAndUpdate({_id: cardId}, {
      expires: expires(1, new Date(Date.now())),
      repeat: false
    })
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

function replaceWordInSentence(translate, sentence) {
  var replacement = "_".repeat(translate.length);


  return sentence.replace(translate, replacement);
}









module.exports = { store, destroy, compare, index, update };