const Theme = require("../models/theme.model");
const User = require("../models/user.model");
const Card = require("../models/card.model");

const store = async (req, res) => {
  const { user } = req;
  const { name, color, lang } = req.body;

  try {

    const newTheme = new Theme({
      name: name,
      color: color,
      lang: lang,
      user: user._id
    });

    const savedTheme = await newTheme.save();

    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { themes: savedTheme._id } }
    );


    return res.status(200).json({
      status: true,
      message: "Theme created successfully!",
      data: savedTheme
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong when the theme is stored",
      error: error
    });
  }

}

const destroy = async (req, res) => {
  const { user } = req;
  const themeId = req.body.id;

  try {
    // Update the user to remove the reference to the theme
    await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { themes: themeId } }
    );

    // Delete associated cards
    await Card.deleteMany({
      theme: themeId
    });

    // Delete the theme
    await Theme.deleteOne({
      _id: themeId
    });

    res.status(200).json({
      status: true,
      message: "Theme deleted successfully"
    });
  } catch (error) {
    console.error('Error occurred while deleting theme', error);
    res.status(500).json({
      status: false,
      message: "Error occurred while deleting theme",
      error: error.message
    });
  }
};

const update = async (req, res) => {
  const { name, color, lang, id } = req.body;
  try {

    const updated = await Theme.findOneAndUpdate({ _id: id }, {
      name: name,
      color: color,
      lang: lang
    });

    res.status(200).json({
      status: true,
      message: "Theme updated successfully!",
    });


  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Theme update error!",
      error: error.message
    });
  }

}




module.exports = { store, destroy, update };