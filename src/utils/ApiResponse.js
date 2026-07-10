class ApiResponse {
  static success(res, { data = null, message = 'Success', meta = null, statusCode = 200 } = {}) {
    const response = { success: true, message, data };
    if (meta) response.meta = meta;
    return res.status(statusCode).json(response);
  }

  static error(res, { message = 'Something went wrong', statusCode = 500, errors = null } = {}) {
    const response = { success: false, message };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
  }

  static paginated(res, { data, page, limit, total, message = 'Success' }) {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) }
    });
  }
}

module.exports = ApiResponse;
