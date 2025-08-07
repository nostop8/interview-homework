class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.message = message || "Resource not found";
  }
}

module.exports = NotFoundError;
