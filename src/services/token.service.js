const jwt = require("jsonwebtoken");
const { env } = require('../constants');

module.exports = {
  create: async (data, expireTime = '24hr') => {
    const validity = env.JWT_ACCESS_TOKEN_VALIDITY || expireTime || '24hr';
    return jwt.sign(data, env.JWT_SECRET, { expiresIn: validity });
  },
  decodedToken: async (token) => {
    return jwt.verify(token, env.JWT_SECRET);
  },
};
