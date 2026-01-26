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
    const { _id } = await TokenService.decodedToken(token);
    let id = _id;
    const userData = await User.findById(id).lean();
    console.log(token, "this is ima here>>>")

    if (!userData) return ErrorHandler.Unauthorized(UserMessages.AUTH_NO_USER);
    console.log(token, "this is ima here>>>")

    console.log("email", userData.phoneNo); // dont remove this line
    // await DbService.update(UserModel, { _id }, { lastActive: new Date() });
    req.user = JSON.parse(JSON.stringify(userData));

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = verifyToken;
