const admin = require('../utils/firebase');
const User = require('../models/User');

const signUp = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    const newUser = new User({
      username,
      email,
      firebaseUID: userRecord.uid
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const token = await admin.auth().createCustomToken(userRecord.uid);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signUp, login };
