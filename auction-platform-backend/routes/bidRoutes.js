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
  useTLS: true
});

router.post('/bids', async (req, res) => {
  const { userID, itemID, bidAmount } = req.body;

  console.log(`Received bid: UserID=${userID}, ItemID=${itemID}, BidAmount=${bidAmount}`);

  try {
    const user = await User.findOne({ uid: userID });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ error: 'User not found' });
    }

    const item = await Item.findById(itemID);
    if (!item) {
      console.log('Item not found');
      return res.status(400).json({ error: 'Item not found' });
    }

    if (item.isAuctioned) {
      console.log('Auction already ended for this item');
      return res.status(400).json({ error: 'This auction has already ended.' });
    }

    if (item.endTime && new Date() > item.endTime) {
      item.isAuctioned = true;
      await item.save();
      console.log('Auction ended due to time threshold');

      pusher.trigger('auction-channel', 'auction-ended', {
        itemID: item._id,
        isAuctioned: true
      });

      return res.status(400).json({ error: 'Auction has ended due to time threshold.' });
    }

    if (bidAmount <= item.currentBid) {
      console.log('Bid amount too low');
      return res.status(400).json({ error: 'Bid must be higher than current bid.' });
    }

    const newBid = new Bid({ userID, itemID, bidAmount });
    await newBid.save();
    console.log('New bid created');

    item.currentBid = bidAmount;
    item.bids.push(newBid._id);

    if (item.maxAmount && bidAmount >= item.maxAmount) {
      item.isAuctioned = true;
      await item.save();
      console.log('Auction ended due to money threshold');

      pusher.trigger('auction-channel', 'auction-ended', {
        itemID: item._id,
        isAuctioned: true
      });

      return res.status(200).json({ message: 'Auction ended due to money threshold.', newBid });
    }

    await item.save();
    console.log('Item updated with new bid');

    pusher.trigger('auction-channel', 'new-bid', {
      itemID,
      bidAmount,
      userID
    });
    console.log('Pusher new-bid event triggered');

    res.status(201).json(newBid);
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
