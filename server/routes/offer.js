const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Mock database
let currentOffer = { imageUrl: '' };

// Get current offer
router.get('/api/offer/image', async (req, res) => {
  // Only send one JSON response with imageUrl
  res.json({ imageUrl: currentOffer.imageUrl || '' });
});

// Update offer image
router.post('/api/offer/image', async (req, res) => {
  try {
    const file = req.body.image; // Base64 image string
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: 'offers',
    });

    currentOffer.imageUrl = uploadResponse.secure_url;
    res.json({ message: 'Offer updated successfully', imageUrl: currentOffer.imageUrl });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ message: 'Failed to update offer' });
  }
});

module.exports = router;
