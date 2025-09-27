class ApiError extends Error {
  constructor(statusCode, message = "Error", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = null;
    this.success = false;
  }
}
export {ApiError}