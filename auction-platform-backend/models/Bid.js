const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  userID: { type: String, required: true },  
  itemID: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  bidAmount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', BidSchema);
