const express = require('express');
const Item = require('../models/Item');
const router = express.Router();

router.post('/items', async (req, res) => {
  const { name, description, images, startingPrice, sellerID } = req.body;
  try {
    const newItem = new Item({ name, description, images, startingPrice, sellerID });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
