const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Pusher = require('pusher');
const cron = require('node-cron'); 
const Item = require('./models/Item'); 
const Bid = require('./models/Bid');
const User = require('./models/User'); 

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

app.use(bodyParser.json());
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bidRoutes = require('./routes/bids');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/users');

app.use('/api', authRoutes); 
app.use('/api', itemRoutes);
app.use('/api', bidRoutes);
app.use('/api', uploadRoutes);
app.use('/api', userRoutes);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

cron.schedule('* * * * *', async () => {
  console.log('Running scheduled task to check auction end times');

  try {
    const now = new Date();
    const itemsToEnd = await Item.find({
      endTime: { $lte: now },
      isAuctioned: false
    });

    itemsToEnd.forEach(async (item) => {
      item.isAuctioned = true;
      await item.save();
      console.log(`Auction ended for item: ${item._id}`);

      pusher.trigger('auction-channel', 'auction-ended', {
        itemID: item._id,
        isAuctioned: true
      });
    });
  } catch (error) {
    console.error('Error running scheduled task:', error);
  }
});

app.get('/', (req, res) => {
  res.send('Auction Platform Backend');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
