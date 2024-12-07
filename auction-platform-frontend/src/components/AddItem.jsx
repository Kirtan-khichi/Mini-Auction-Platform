import React, { useState, useEffect } from "react";
import { uploadImage } from "../services/firebaseService";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import { useNavigate } from "react-router-dom";
import '../assets/css/AddItem.css'; // Import CSS for styling

function AddItem() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [itemImages, setItemImages] = useState([]); 
  const [uploading, setUploading] = useState(false);
  const [imageURLs, setImageURLs] = useState([]); 
  const [userID, setUserID] = useState(""); 
  const [loading, setLoading] = useState(true); // New loading state for Firebase Auth

  const navigate = useNavigate(); 

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserID(user.uid); // User is logged in
        setLoading(false); // Stop loading once auth is checked
      } else {
        setLoading(false); // Stop loading if no user is found
        navigate("/login"); // Redirect to login if user is not logged in
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigate]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setItemImages([...itemImages, ...files]); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (itemImages.length === 0 || !itemName || !startingPrice) {
      alert('Please fill out all fields and upload at least one image.');
      return;
    }
  
    setUploading(true);
  
    try {
      const uploadPromises = itemImages.map((image) => uploadImage(image));
      const uploadedImageURLs = await Promise.all(uploadPromises);
  
      setImageURLs(uploadedImageURLs); 
  
      const newItem = {
        name: itemName,
        description: itemDescription,
        images: uploadedImageURLs,
        startingPrice: parseFloat(startingPrice),
        currentBid: 0,
        sellerID: userID,
      };
  
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem), 
      });
  
      if (!response.ok) {
        throw new Error('Error creating item.');
      }
  
      const data = await response.json();
      console.log('Item added:', data);
  
      setItemName('');
      setItemDescription('');
      setStartingPrice('');
      setItemImages([]);
      setImageURLs([]);
      setUploading(false);
      alert('Item added successfully!');
      navigate('/home'); 
    } catch (error) {
      console.error('Error uploading item:', error);
      alert('Error adding item.');
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>; // Show loading state while checking Firebase Auth state
  }

  return (
    <div className="add-item-container">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit} className="add-item-form">
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="add-item-input"
          required
        />
        <textarea
          placeholder="Item Description"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          className="add-item-textarea"
        />
        <input
          type="number"
          placeholder="Starting Price"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          className="add-item-input"
          required
        />
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          multiple
          className="add-item-file-input"
        />
        <button type="submit" className="add-item-btn" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Item"}
        </button>
      </form>

      {imageURLs.length > 0 && (
        <div className="uploaded-images">
          <h3>Uploaded Images:</h3>
          <div className="images-gallery">
            {imageURLs.map((url, index) => (
              <img key={index} src={url} alt={`Uploaded item ${index}`} className="uploaded-image" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddItem;
