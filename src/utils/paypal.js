const axios = require('axios');
const { logger } = require('../config/logger');

const generateAccessToken = async () => {
  try {
    if (!process.env.Paypal_ClientId || !process.env.Paypal_Secret_Key) {
      logger.error({ message: 'Missing Paypal Credentials.' });
      return false;
    }
    const auth = Buffer.from(
      process.env.Paypal_ClientId + ':' + process.env.Paypal_Secret_Key
    ).toString('base64');
    const response = await axios.post(
      `${process.env.Paypal_Api_Url}/v1/oauth2/token`,
      'grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    if (!response?.data?.access_token) {
      logger.error({ message: 'Token not generated.' });
      return false;
    }
    return response.data.access_token;
  } catch (error) {
    logger.error({ message: 'Failed to generate Access Token', error: error.message });
    return false;
  }
};

module.exports = { generateAccessToken };
