import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import '../assets/css/Navbar.css';

const Navbar = () => {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const location = useLocation(); // Get the current location (path)

  const toggleProfileSection = () => {
    setIsProfileVisible((prev) => !prev);
  };

  // Conditionally render based on the current path
  const isHomePage = location.pathname === "/"; 

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          AuctionIt
        </Link>
      </div>
      <div className="navbar-right">
        {/* Conditionally render 'Add Item' button and profile if not on Home page */}
        {!isHomePage && (
          <>
            <Link to="/add-item" className="btn-add-item">
              Add Item
            </Link>

            {/* Profile Section */}
            <div className="profile-section">
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="profile-image"
                onClick={toggleProfileSection}
              />
              {isProfileVisible && (
                <div className="profile-dropdown">
                  <ul>
                    <li><Link to="/profile">My Profile</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* If on Home page, show "Get Started" */}
        {isHomePage && (
          <Link to="/login" className="btn-get-started">
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
