const { env } = require("../../constants");
const { DbService, TokenService, ErrorHandler } = require("../../services");
const UserMessages = require("../../constants/messages/user.messages");
const { UserModel } = require("../../models");

module.exports.getUserString = async function ({ userId }) {
  try {
    const user = await DbService.findOne(UserModel, { _id: userId });
    if (!user) ErrorHandler.BadRequest(UserMessages.AUTH_NO_USER);
    const token = await TokenService.create({ _id: user._id }, { expiresIn: "24h" });
    const user1 = `
      <p>Hello ${user.firstName || "Global Tongue User"}</p>
      <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Click <a href="${env.LINK}reset-password/${token}">here</a> to reset your password.</p>
      <p>Thanks,<br>Global Tongue Team</p>
    `;
    return user1;
  } catch (error) { }
};
