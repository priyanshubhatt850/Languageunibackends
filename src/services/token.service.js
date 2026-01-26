const jwt = require("jsonwebtoken");
const { env } = require('../constants')
module.exports = {
  create: (data, expireTime = '24hr') => {
    return new Promise(async (resolve, reject) => {
      try {
        const validity = env.JWT_ACCESS_TOKEN_VALIDITY || expireTime || '24hr';
        console.log('validity', validity)
        const token = jwt.sign(data, env.JWT_SECRET, { expiresIn: validity });
        // const token = jwt.sign(data, env.JWT_SECRET, expireTime);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  },
  decodedToken: (token) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = jwt.verify(token, env.JWT_SECRET);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  },

};
