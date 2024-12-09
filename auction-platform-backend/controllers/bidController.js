const placeBid = async (req, res) => {
    const { userID, itemID, bidAmount } = req.body;
  
    try {
      const item = await Item.findById(itemID);
  
      if (item.isAuctioned) {
        return res.status(400).json({ error: 'This auction has ended.' });
      }
  
      if (item.endTime && new Date() > item.endTime) {
        item.isAuctioned = true;
        await item.save();
      
        pusher.trigger('auction-channel', 'auction-ended', {
          itemID: item._id,
          isAuctioned: true
        });
      
        return res.status(400).json({ error: 'Auction has ended due to time threshold.' });
      }
      
      
      if (item.maxAmount && bidAmount >= item.maxAmount) {
        item.isAuctioned = true;
        item.currentBid = bidAmount;
        await item.save();
      
        pusher.trigger('auction-channel', 'auction-ended', {
          itemID: item._id,
          isAuctioned: true
        });
      
        return res.status(200).json({ message: 'Auction has ended due to money threshold.', item });
      }
      
      
  
      if (bidAmount <= item.currentBid) {
        return res.status(400).json({ error: 'Your bid must be higher than the current bid.' });
      }
  
      const newBid = new Bid({ userID, itemID, bidAmount });
      await newBid.save();
  
      item.currentBid = bidAmount;
      item.bids.push(newBid._id);
      await item.save();
  
      res.status(201).json(newBid);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  module.exports = { placeBid };
  