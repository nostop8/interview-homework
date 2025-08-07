const debug = require('../misc/debug');
const NotFoundError = require("../misc/not-found.error");
const ValidationError = require("../misc/validation.error");

function responseErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(400).json({ errors: err.issues });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  debug("Error:", err);
  return res.status(500).json({ error: "Unexpected error" });
}

function createController(handler) {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res, next);

      if (!res.headersSent) {
        if (res.statusCode === undefined) {
          res.status(200);
        }

        res.json(result);
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  responseErrorHandler,
  createController,
};
