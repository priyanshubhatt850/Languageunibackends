const returnError = (statusCode, message) => {
  return {
    statusCode,
    response: {
      status: false,
      code: statusCode,
      message,
    },
  };
};
const returnSuccess = (statusCode, message, data = {}) => {

  return {
    statusCode,
    response: {
      status: true,
      code: statusCode,
      message,
      data,
    },
  };
};

module.exports = {
  returnError,
  returnSuccess,
};
