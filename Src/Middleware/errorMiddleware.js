const AppError = require("../Utils/AppError");

const errorHandler = (error, req, res, next) => {
  console.log(error);

  if (error.name === "ValidationError") {
    return res.status(400).send({
      type: "ValidationError",
      details: error.details,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      errorCode: error.errorCode,
    });
  }

  // Return proper error message
  return res.status(500).json({
    success: false,
    message: error.message || "Something went wrong",
    error: process.env.NODE_ENV === 'development' ? error : undefined
  });
};

module.exports = errorHandler;