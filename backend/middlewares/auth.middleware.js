import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers; //authorization part
    if (!authorization) {
      return res.status(401).send({
        message: "Unauthorized User",
      });
    }

    const parts = authorization.split(" "); // split into bearer and token

    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
      return res.status(401).send({
        message: "Invalid authorization format",
      });
    }

    const token = parts[1]; // choose the token

    const decoded = jwt.verify(token, process.env.SECRET_KEY); // verifying that token is made by valid secret key

    req.user = decoded; // making it usable for another controller

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyToken;
