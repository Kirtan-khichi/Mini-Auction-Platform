import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  return (
    <div>
      <h3>{item.name}</h3>
      <img src={item.images[0]} alt={item.name} />
      <p>{item.description}</p>
      <p>Starting Price: ${item.startingPrice}</p>
      <Link to={`/item/${item._id}`}>View Item</Link>
    </div>
  );
};

export default ItemCard;
