const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json("Token Missing !!!");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWTSECRET);

    req.user = decoded; // attach full user
    next();

  } catch (err) {
    return res.status(401).json("Invalid Token.... Please Login !!!");
  }
};

module.exports = authMiddleware;