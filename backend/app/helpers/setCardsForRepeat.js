const Card = require("../models/card.model");

async function setCardsForRepeat(userId) {
  const now = new Date();

  // Frissítjük azokat a rekordokat, amelyek lejártak
  const expiredRecords = await Card.find({ 
    expires: { $lt: now },
    state: {$lt: 6},
    user: userId
  });


  

  expiredRecords.forEach(async (record) => {
    await Card.findOneAndUpdate(
      { _id: record._id },
      { repeat: true },
      { new: true }
    );
  });

/*   // Frissítjük azokat a rekordokat, amelyek nem jártak le
  const notExpiredRecords = await Card.find({ 
    expires: { $gte: now },
    user: userId
  });

  notExpiredRecords.forEach(async (record) => {
    await Card.findOneAndUpdate(
      { _id: record._id },
      { repeat: false },
      { new: true }
    );
  }); */
}

module.exports = setCardsForRepeat;
