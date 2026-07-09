class ErrorHandler {
  static BadRequest(message) {
    const error = new Error(message || "Bad Request");
    error.statusCode = 400;
    error.status = "error";
    error.name = "RestException";
    throw error;
  }

  static Unauthorized(message) {
    const error = new Error(message || "Unauthorized");
    error.statusCode = 401;
    error.status = "error";
    error.name = "RestException";
    throw error;
  }

  static NotFound(message) {
    const error = new Error(message || "Not Found");
    error.statusCode = 404;
    error.status = "error";
    error.name = "RestException";
    throw error;
  }

  static Forbidden(message) {
    const error = new Error(message || "Forbidden");
    error.statusCode = 403;
    error.status = "error";
    error.name = "RestException";
    throw error;
  }

  static InternalServerError(message) {
    const error = new Error(message || "Internal Server Error");
    error.statusCode = 500;
    error.status = "error";
    error.name = "RestException";
    throw error;
  }
}

module.exports = ErrorHandler;
