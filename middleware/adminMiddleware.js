const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  console.log("--- START ADMIN AUTH MIDDLEWARE ---");
  
  try {
    const authHeader = req.headers["authorization"];
    
    // 1. Safe validation check on header existence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Authorization Header Missing or Malformed");
      return res.status(401).json({ message: "Authorization Failed. Token Missing!" });
    }

    const token = authHeader.split(" ")[1];
    
    // 2. Decode and verify signature
    const jwtResponse = jwt.verify(token, process.env.JWTSECRET);
    
    // 🔍 CRITICAL BACKEND LOGGING
    // Look at your Node terminal window to see what prints here!
    console.log("Decoded JWT Payload Content:", jwtResponse);
    
    // 3. Robust fallbacks for token variations (checks email, userMail, role)
    const userEmail = jwtResponse.email || jwtResponse.userMail;
    const userRole = jwtResponse.role;

    if (!userRole) {
      console.log("❌ Role key missing inside JWT payload structural layout");
      return res.status(401).json({ message: "Invalid Token Payload Structure" });
    }

    // 4. Strict matching logic check
    if (userRole === "admin") {
      req.payload = userEmail; // Assign to request object safely
      console.log("✅ Admin verified. Proceeding to controller...");
      next();
    } else {
      console.log(`❌ Access Denied: User role is "${userRole}", not "admin"`);
      res.status(403).json({ message: "Authorization Failed. Access Denied (Admins Only)!" });
    }

  } catch (err) {
    console.error("💥 Middleware Crash Error Log:", err.message);
    res.status(401).json({ message: "Session expired or invalid token. Please log in again." });
  }
};

module.exports = adminMiddleware;