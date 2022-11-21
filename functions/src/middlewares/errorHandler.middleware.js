const { logger } = require("firebase-functions");

const handleErrors = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  logger.error(err.message, err.stack);
  res
    .status(statusCode)
    .json({ statusCode, message: err.message });

  return;
};

module.exports.handleErrors = handleErrors;
