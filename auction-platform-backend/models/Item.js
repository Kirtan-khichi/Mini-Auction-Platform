const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  images: [String],
  startingPrice: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  sellerID: { type: String },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }]
});

module.exports = mongoose.model('Item', ItemSchema);
