import React, { useState, useEffect } from 'react';
import API from '../api';
import './AdminOfferSettings.css';

const AdminOfferSettings = () => {
  const [offerImage, setOfferImage] = useState('');
  const [offerText, setOfferText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_cloudinary_preset');

    try {
      setLoading(true);
      const res = await fetch('https://api.cloudinary.com/v1_1/your_cloudinary_name/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setOfferImage(data.secure_url);
      setLoading(false);
    } catch (err) {
      console.error('Image upload failed:', err);
      setLoading(false);
    }
  };

  const handleSave = () => {
    API.post('/admin/offer', { imageUrl: offerImage, text: offerText })
      .then(res => {
        if (res.data.success) alert('Offer updated successfully!');
      })
      .catch(err => console.error('Failed to update offer:', err));
  };

  return (
    <div className="admin-offer-settings">
      <h2>Offer Settings</h2>
      <div className="form-group">
        <label>Upload Offer Image:</label>
        <input type="file" onChange={handleImageUpload} />
        {loading && <p>Uploading...</p>}
        {offerImage && <img src={offerImage} alt="Offer Preview" className="offer-preview" />}
      </div>
      <div className="form-group">
        <label>Offer Text:</label>
        <textarea value={offerText} onChange={(e) => setOfferText(e.target.value)} />
      </div>
      <button onClick={handleSave} disabled={loading}>Save Offer</button>
    </div>
  );
};

export default AdminOfferSettings;
