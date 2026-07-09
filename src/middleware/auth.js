const User = require("../models/User");
const { DbService, TokenService, ErrorHandler } = require("../services");
const UserMessages = require("../constants/messages/user.messages");
// const { getIo } = require("../sockets/socket");
// const { getConnected } = require("../services/socket.services");
// const TokenService = require('../services/token.service')
const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) return ErrorHandler.BadRequest(UserMessages.AUTH_INVALID_TOKEN);
    const token = req.headers.authorization.split(" ")[1];
    console.log(token, "this is token>>>")
    if (!token) return ErrorHandler.Unauthorized();
    const decoded = await TokenService.decodedToken(token);
    console.log(decoded,"this is decoded")
    let id = decoded._id;
    
    console.log(id,"this is id>>>>>>>")
    const userData = await User.findById(id).lean();
    console.log(token, "this is ima here>>>")

    if (!userData) return ErrorHandler.Unauthorized(UserMessages.AUTH_NO_USER);
    console.log(token, "this is ima here>>>")

    // Daily streak feature calculation
    const todayStr = new Date().toISOString().slice(0, 10);
    if (userData.last_active_date !== todayStr) {
      let newStreak = 1;
      if (userData.last_active_date) {
        const todayDate = new Date(todayStr);
        const lastDate = new Date(userData.last_active_date);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak = (userData.streak_count || 0) + 1;
        }
      }
      await User.updateOne(
        { _id: userData._id },
        { $set: { streak_count: newStreak, last_active_date: todayStr } }
      );
      userData.streak_count = newStreak;
      userData.last_active_date = todayStr;
    }

    console.log("email", userData.phoneNo); // dont remove this line
    // await DbService.update(UserModel, { _id }, { lastActive: new Date() });
    req.user = JSON.parse(JSON.stringify(userData));

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = verifyToken;
