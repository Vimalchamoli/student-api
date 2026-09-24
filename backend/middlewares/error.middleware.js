import JsonWebToken from "jsonwebtoken";

const errorHandler = (error, req, res, next) => {
  if (error.code === 11000) {
    if (error.keyValue.email) {
      return res.status(400).send("email already exists");
    }
    if (error.keyValue.name) {
      return res.status(400).send("username already taken");
    }
  }
  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    return res.status(401).send({
      message: "Invalid or Expired Token",
    });
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).send({
    message: error.message || "Internal Server Error",
  });
};

export default errorHandler;
