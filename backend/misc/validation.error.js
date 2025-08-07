class ValidationError extends Error {
  constructor({ message, issues }) {
    super(message);
    this.issues = issues;
  }
}

module.exports = ValidationError;
