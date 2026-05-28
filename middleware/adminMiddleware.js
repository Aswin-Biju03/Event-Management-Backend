const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  console.log("--- START ADMIN AUTH MIDDLEWARE ---");
  
  try {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Authorization Header Missing or Malformed");
      return res.status(401).json({ message: "Authorization Failed. Token Missing!" });
    }

    const token = authHeader.split(" ")[1];
    const jwtResponse = jwt.verify(token, process.env.JWTSECRET);
    
    console.log("Decoded JWT Payload Content:", jwtResponse);
    
    const userEmail = jwtResponse.email || jwtResponse.userMail;
    const userRole = jwtResponse.role;

    if (!userRole) {
      console.log("❌ Role key missing inside JWT payload");
      return res.status(401).json({ message: "Invalid Token Payload Structure" });
    }

    if (userRole === "admin") {
      // ✅ Store id if available, fall back to email
      req.payload = jwtResponse.id || jwtResponse._id || userEmail;
      console.log("✅ Admin verified. req.payload:", req.payload);
      next();
    } else {
      console.log(`❌ Access Denied: role is "${userRole}"`);
      res.status(403).json({ message: "Authorization Failed. Admins Only!" });
    }

  } catch (err) {
    console.error("💥 Middleware Crash:", err.message);
    res.status(401).json({ message: "Session expired or invalid token." });
  }
};

module.exports = adminMiddleware;