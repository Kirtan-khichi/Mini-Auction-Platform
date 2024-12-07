const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Pusher = require('pusher');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bidRoutes = require('./routes/bids');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/users');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.use('/api', authRoutes); 
app.use('/api', itemRoutes);
app.use('/api', bidRoutes);
app.use('/api', uploadRoutes);
app.use('/api', userRoutes);


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

app.get('/', (req, res) => {
  res.send('Auction Platform Backend');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
