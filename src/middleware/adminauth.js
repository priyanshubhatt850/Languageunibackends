const { UserModel } = require("../models");
const { DbService, TokenService, ErrorHandler } = require("../services");
const UserMessages = require("../constants/messages/user.messages");

const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) return ErrorHandler.BadRequest(UserMessages.AUTH_INVALID_TOKEN);
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return ErrorHandler.Unauthorized();
    const { _id } = await TokenService.decodedToken(token);
    const user = await DbService.findOne(UserModel, { _id, role: 'admin' });
    if (!user) return ErrorHandler.BadRequest(UserMessages.AUTH_NO_USER);

    await DbService.update(UserModel, { _id }, { lastActive: new Date() });
    req.user = JSON.parse(JSON.stringify(user));
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = verifyToken;
