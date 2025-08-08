import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OfferSettings = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [currentOffer, setCurrentOffer] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current offer image
    axios.get('/api/offer').then(res => {
      setCurrentOffer(res.data.imageUrl);
    });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    // Cloudinary upload
    const cloudinaryRes = await axios.post('https://api.cloudinary.com/v1_1/<cloud_name>/image/upload', formData, {
      params: {
        upload_preset: '<upload_preset>'
      }
    });
    const imageUrl = cloudinaryRes.data.secure_url;
    // Save image URL to backend
    await axios.post('/api/offer', { imageUrl });
    setCurrentOffer(imageUrl);
    setLoading(false);
    setImage(null);
    setPreview('');
    alert('Offer updated!');
  };

  return (
    <div>
      <h2>Offer Settings</h2>
      <div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" style={{ width: 200 }} />}
        <button onClick={handleUpload} disabled={loading}>Upload</button>
      </div>
      <div>
        <h3>Current Offer Image:</h3>
        {currentOffer && <img src={currentOffer} alt="Current Offer" style={{ width: 200 }} />}
      </div>
    </div>
  );
};

export default OfferSettings;
