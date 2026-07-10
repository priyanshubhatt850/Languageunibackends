const AIChatHistory = require('../models/AIChatHistory');
const axios = require('axios');

class AIChatService {
  async getHistory(userId) {
    let history = await AIChatHistory.findOne({ user_id: userId });
    if (!history) {
      history = await AIChatHistory.create({ user_id: userId, messages: [] });
    }
    return history;
  }

  async sendMessage(userId, prompt) {
    try {
      let history = await AIChatHistory.findOne({ user_id: userId });
      if (!history) {
        history = await AIChatHistory.create({ user_id: userId, messages: [] });
      }

      // 1. Prepare system instruction and contents history for Gemini API
      const systemInstruction = {
        parts: [{ 
          text: "You are a professional, friendly, and engaging AI Language Coach on the Global Tongue platform. " +
                "Help the student practice their target language (English, French, Japanese, etc.). " +
                "Encourage them, gently correct grammar or vocabulary errors in their messages, " +
                "suggest better phrasing, and keep the conversation alive. Keep responses conversational and relatively short." 
        }]
      };

      // Map existing messages to Gemini format (roles: 'user' and 'model')
      const formattedContents = history.messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Append current prompt
      formattedContents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      // 2. Query Gemini API
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables");
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: formattedContents,
        systemInstruction: systemInstruction
      };

      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Parse response
      const candidates = response?.data?.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error("No response candidates returned from Gemini API");
      }

      const aiResponse = candidates[0].content.parts[0].text;

      // 3. Save to database history
      history.messages.push({ sender: 'user', text: prompt });
      history.messages.push({ sender: 'ai', text: aiResponse });
      await history.save();

      return {
        success: true,
        response: aiResponse,
        history
      };

    } catch (error) {
      console.error("Gemini AI Tutor error:", error.response?.data || error.message);
      
      let friendlyMessage = "Failed to communicate with AI Coach.";
      const apiError = error.response?.data?.error;
      
      if (apiError) {
        if (apiError.code === 404) {
          friendlyMessage = "Gemini model not found. This usually means your API key is invalid, or the 'Generative Language API' is not enabled on this key. Please check your AI Studio key.";
        } else if (apiError.code === 400 || apiError.code === 403) {
          friendlyMessage = "Gemini API key is invalid or unauthorized. Please verify your GEMINI_API_KEY in the .env configuration.";
        } else {
          friendlyMessage = `Gemini API Error: ${apiError.message}`;
        }
      }

      return {
        success: false,
        message: friendlyMessage
      };
    }
  }

  async clearHistory(userId) {
    const history = await AIChatHistory.findOne({ user_id: userId });
    if (history) {
      history.messages = [];
      await history.save();
    }
    return { success: true, history };
  }
}

module.exports = new AIChatService();
