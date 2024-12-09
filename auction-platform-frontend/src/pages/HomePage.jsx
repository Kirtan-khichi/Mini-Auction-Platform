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
            console.log('Received new-bid event:', data);
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item._id === data.itemID ? { ...item, currentBid: data.bidAmount } : item
                )
            );
        });
        
        channel.bind('auction-ended', function (data) {
            console.log('Received auction-ended event:', data);
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item._id === data.itemID ? { ...item, isAuctioned: data.isAuctioned } : item
                )
            );
        });
        
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, []);
    

    useEffect(() => {
        fetch('https://mini-auction-platform.onrender.com/api/items')
            .then((response) => response.json())
            .then((data) => setItems(data))
            .catch((error) => console.error('Error fetching items:', error));
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
            const response = await fetch('https://mini-auction-platform.onrender.com/api/bids', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bidData),
            });
            const data = await response.json();

            if (response.status === 201 || response.status === 200) {
                alert(data.message || `Bid of ₹${bidAmount} placed successfully!`);
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
                        {item.maxAmount && <p>Money Threshold: ₹{item.maxAmount}</p>}
                        {item.endTime && <p>Ends At: {new Date(item.endTime).toLocaleString()}</p>}
                        {item.isAuctioned ? (
                            <p className="auctioned-status">Sold</p>
                        ) : (
                            <button
                                onClick={() => {
                                    const bidAmount = prompt('Enter your bid amount:', item.currentBid + 1);
                                    const numericBid = parseFloat(bidAmount);
                                    if (bidAmount && numericBid > item.currentBid) {
                                        placeBid(item._id, numericBid);
                                    } else {
                                        alert('Please enter a valid bid amount greater than the current bid.');
                                    }
                                }}
                            >
                                Bid Now
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
