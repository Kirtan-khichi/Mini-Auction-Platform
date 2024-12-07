import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BidForm from '../components/BidForm';

const ItemPage = ({ match }) => {
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/items/${match.params.id}`)
      .then(response => setItem(response.data))
      .catch(error => console.error(error));
  }, [match.params.id]);

  return (
    item && (
      <div>
        <h1>{item.name}</h1>
        <img src={item.images[0]} alt={item.name} />
        <p>{item.description}</p>
        <p>Starting Price: ${item.startingPrice}</p>
        <BidForm itemId={item._id} />
      </div>
    )
  );
};

export default ItemPage;
