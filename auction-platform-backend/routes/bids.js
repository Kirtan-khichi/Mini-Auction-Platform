const express = require('express');
const Bid = require('../models/Bid');
const Item = require('../models/Item');
const User = require('../models/User'); 
const Pusher = require('pusher');
const router = express.Router();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true
});

router.post('/bids', async (req, res) => {
  const { userID, itemID, bidAmount } = req.body;

  try {
    const user = await User.findOne({ uid: userID }); 
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const item = await Item.findById(itemID);
    if (!item) {
      return res.status(400).json({ error: 'Item not found' });
    }

    if (bidAmount <= item.currentBid) {
      return res.status(400).json({ error: 'Bid must be higher than current bid' });
    }

    const newBid = new Bid({ userID, itemID, bidAmount });
    await newBid.save();

    item.currentBid = bidAmount;
    item.bids.push(newBid._id); 
    await item.save();

    pusher.trigger('auction-channel', 'new-bid', {
      itemID,
      bidAmount,
      userID
    });

    res.status(201).json(newBid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
