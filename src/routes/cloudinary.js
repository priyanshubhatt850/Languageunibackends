/**
 * Cloudinary Routes (Backend)
 * Handle server-side operations like deletion with proper authentication
 */

const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

// Middleware to verify authentication
const  verifyAuth = require('../middleware/auth');

/**
 * DELETE /api/cloudinary/delete
 * Delete a file from Cloudinary
 * 
 * Body: {
 *   publicId: string - Cloudinary public ID
 * }
 * 
 * Response: {
 *   success: boolean,
 *   result: object - Cloudinary deletion response,
 *   message: string
 * }
 */
router.post('/delete', verifyAuth, async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    res.json({
      success: result.result === 'ok',
      result,
      message: result.result === 'ok' ? 'File deleted successfully' : 'Failed to delete file'
    });
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete file'
    });
  }
});

/**
 * GET /api/cloudinary/resources
 * Get information about resources in Cloudinary (requires authentication)
 * 
 * Query params:
 *   prefix: string - Filter by prefix/folder
 *   type: string - Type of resource ('image', 'video', 'raw')
 *   max_results: number - Max results to return (default: 10)
 */
router.get('/resources', verifyAuth, async (req, res) => {
  try {
    const { prefix = 'language-uni', type = 'image', max_results = 10 } = req.query;

    const resources = await cloudinary.api.resources({
      type: 'upload',
      resource_type: type,
      prefix,
      max_results: parseInt(max_results)
    });

    res.json({
      success: true,
      resources
    });
  } catch (error) {
    console.error('Cloudinary resources error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch resources'
    });
  }
});

module.exports = router;
