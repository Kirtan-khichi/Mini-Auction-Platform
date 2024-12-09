import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import '../assets/css/Navbar.css';

const Navbar = () => {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const location = useLocation(); 
  const toggleProfileSection = () => {
    setIsProfileVisible((prev) => !prev);
  };

  const isHomePage = location.pathname === "/"; 

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          AuctionIt
        </Link>
      </div>
      <div className="navbar-right">
        {!isHomePage && (
          <>
            <Link to="/add-item" className="btn-add-item">
              Add Item
            </Link>

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
