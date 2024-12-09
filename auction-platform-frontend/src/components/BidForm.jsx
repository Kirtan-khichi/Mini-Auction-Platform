import React, { useState } from 'react';
import axios from 'axios';

const BidForm = ({ itemId }) => {
  const [bidAmount, setBidAmount] = useState('');

  const handleBidSubmit = (e) => {
    e.preventDefault();
    axios.post('https://mini-auction-platform.onrender.com/api/bids', { itemId, bidAmount }) 
      .then(response => {
        alert('Bid placed successfully');
      })
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleBidSubmit}>
      <input type="number" placeholder="Enter bid amount" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} required />
      <button type="submit">Place Bid</button>
    </form>
  );
};

export default BidForm;
