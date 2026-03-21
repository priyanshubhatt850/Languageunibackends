/**
 * Cloudinary Configuration for Backend
 * Initialize Cloudinary with API credentials
 * 
 * Add to your .env file:
 * CLOUDINARY_CLOUD_NAME=your_cloud_name
 * CLOUDINARY_API_KEY=your_api_key
 * CLOUDINARY_API_SECRET=your_api_secret
 */

const cloudinary = require('cloudinary').v2;

const initializeCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  console.log('Cloudinary initialized:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '***' : 'not set',
    api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'not set',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'not set'
  });
};

const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

module.exports = {
  cloudinary,
  initializeCloudinary,
  isCloudinaryConfigured
};
