import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { getAuth } from 'firebase/auth';
import '../assets/css/style.css';


const HomePage = () => {
    const [items, setItems] = useState([]);
    const [userID, setUserID] = useState('');

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUserID(user.uid);
        } else {
            console.log('User not logged in');
        }
    }, []);

    useEffect(() => {
        const pusher = new Pusher('b472bc7e618991d3b479', {
            cluster: 'ap2',
        });
        const channel = pusher.subscribe('auction-channel');
        channel.bind('new-bid', function (data) {
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item._id === data.itemID ? { ...item, currentBid: data.bidAmount } : item
                )
            );
        });
        return () => {
            pusher.unsubscribe('auction-channel');
        };
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/api/items')
            .then((response) => response.json())
            .then((data) => setItems(data))
            .catch((error) => console.error('Error:', error));
            console.log("data", items)

    }, []);

    const placeBid = async (itemID, bidAmount) => {
        if (!userID) {
            alert('You must be logged in to place a bid!');
            return;
        }

        const bidData = {
            userID,
            itemID,
            bidAmount,
        };

        try {
            const response = await fetch('http://localhost:5000/api/bids', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bidData),
            });
            const data = await response.json();

            if (response.status === 201) {
                alert(`Bid of ₹${bidAmount} placed successfully!`);
            } else {
                alert(data.error || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Error placing bid:', error);
            alert('Error placing bid');
        }
    };

    return (
        <div className="home-page">
            <h2>Live Auctions</h2>
            <div className="auction-items">
                {items.map((item) => (
                    <div key={item._id} className="auction-item">
                        <div className="auction-item-images">
                            {item.images && item.images.map((imageUrl, index) => (
                                <img
                                    key={index}
                                    src={imageUrl}  
                                    alt={`${item.name} - ${index + 1}`}
                                    className="auction-item-image"
                                />
                            ))}
                        </div>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p>Starting Price: ₹{item.startingPrice}</p>
                        <p>Current Bid: ₹{item.currentBid}</p>
                        <button
                            onClick={() => {
                                const bidAmount = prompt('Enter your bid amount:', item.currentBid + 1);
                                if (bidAmount && bidAmount > item.currentBid) {
                                    placeBid(item._id, parseInt(bidAmount));
                                } else {
                                    alert('Please enter a valid bid amount.');
                                }
                            }}
                        >
                            Bid Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
