// controllers/itemController.js
const Item = require('../models/Item');

const createItem = async (req, res) => {
  console.log('Request Body:', req.body);  // Log the incoming request body

  const { name, description, startingPrice, sellerID, images } = req.body;

  try {
    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'Images are required' });
    }

    const newItem = new Item({
      name,
      description,
      startingPrice,
      currentBid: startingPrice,
      sellerID,
      images 
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);  // Log the error
    res.status(500).json({ error: error.message });
  }
};


// Get All Items (Auction)
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createItem, getAllItems };
