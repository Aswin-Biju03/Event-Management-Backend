const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization Failed. Token Missing!" });
    }
    const token = authHeader.split(" ")[1];
    const jwtResponse = jwt.verify(token, process.env.JWTSECRET);
    const userRole = jwtResponse.role;
    if (!userRole) {
      return res.status(401).json({ message: "Invalid Token Payload Structure" });
    }
    if (userRole === "admin") {
      req.payload = jwtResponse.id || jwtResponse._id || jwtResponse.email;
      next();
    } else {
      res.status(403).json({ message: "Access Denied. Admins Only!" });
    }
  } catch (err) {
    res.status(401).json({ message: "Session expired or invalid token." });
  }
};

module.exports = adminMiddleware;