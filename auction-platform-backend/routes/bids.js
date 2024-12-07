const express = require('express');
const Bid = require('../models/Bid');
const Item = require('../models/Item');
const User = require('../models/User'); // Import the User model
const Pusher = require('pusher');
const router = express.Router();

// Initialize Pusher using environment variables
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true
});

// Route to place a bid
router.post('/bids', async (req, res) => {
  const { userID, itemID, bidAmount } = req.body;

  try {
    // Validate user by `uid` (not `_id`)
    const user = await User.findOne({ uid: userID }); // Query by `uid`, not `_id`
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Validate item
    const item = await Item.findById(itemID);
    if (!item) {
      return res.status(400).json({ error: 'Item not found' });
    }

    // Validate bid amount
    if (bidAmount <= item.currentBid) {
      return res.status(400).json({ error: 'Bid must be higher than current bid' });
    }

    // Create new bid
    const newBid = new Bid({ userID, itemID, bidAmount });
    await newBid.save();

    // Update item's current bid
    item.currentBid = bidAmount;
    item.bids.push(newBid._id); // Optionally, you can push the bid ID to the item
    await item.save();

    // Trigger Pusher event to notify clients about the new bid
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
