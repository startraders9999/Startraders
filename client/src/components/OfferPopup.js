import React, { useState, useEffect } from 'react';
import './OfferPopup.css';

const OfferPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [offerImage, setOfferImage] = useState('');

  useEffect(() => {
    // Simulate API call to fetch offer image
    fetch('/api/offer')
      .then((response) => response.json())
      .then((data) => {
        setOfferImage(data.imageUrl);
        setShowPopup(true);
      })
      .catch((error) => console.error('Error fetching offer:', error));
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    showPopup && (
      <div className="offer-popup-overlay">
        <div className="offer-popup-box">
          <img src={offerImage} alt="Offer" className="offer-image" />
          <button className="close-button" onClick={closePopup}>X</button>
        </div>
      </div>
    )
  );
};

export default OfferPopup;
