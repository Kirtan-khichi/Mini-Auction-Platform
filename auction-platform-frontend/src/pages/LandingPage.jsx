import { Link } from 'react-router-dom';
import '../assets/css/LandingPage.css';
// import { frontPage } from "../assets/images/frontPage.png"

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to AuctionIt</h1>
        <p>Your one-stop mini auction platform to bid, win, and sell!</p>
        <p>Join the community of auction enthusiasts and grab the best deals!</p>
        <Link to="/login">
          <button className="get-started-btn">Get Started</button>
        </Link>
      </div>
      <div className="image-side">
        <img
          src="https://dummyimage.com/500x500/000/fff" // Placeholder image link, replace with actual image
          alt="Auction"
          className="landing-image"
        />
      </div>
    </div>
  );
};

export default LandingPage;
