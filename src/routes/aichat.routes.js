const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware');
const aiChatController = require('../controllers/aichatController');

// All AI tutor chat routes require user authentication
router.use(authMiddleware);

router.get('/history', aiChatController.getHistory);
router.post('/message', aiChatController.sendMessage);
router.post('/clear', aiChatController.clearHistory);

module.exports = router;
