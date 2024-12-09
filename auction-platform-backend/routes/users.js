const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/users', async (req, res) => {
  const { firstName, lastName, email, uid } = req.body;
  try {
    const newUser = new User({ firstName, lastName, email, uid });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;