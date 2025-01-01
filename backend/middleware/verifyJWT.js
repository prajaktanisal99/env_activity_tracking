import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  console.log(req.body);
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check if Authorization header is present and correctly formatted

  if (!authHeader?.startsWith("Bearer ")) {
    console.log("returning 401!");
    return res
      .status(312)
      .json({ message: "No or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(
        `[${new Date().toISOString()}] Error verifying token: ${err.name}`
      );

      if (err.name === "TokenExpiredError") {
        console.error("Token expired at:", err.expiredAt);
        return res.status(401).json({
          message: "Token expired",
          expiredAt: err.expiredAt,
        });
      }

      return res.status(403).json({ message: "Invalid token" }); // Forbidden
    }

    req.user = decoded; // Attach decoded payload to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

export default verifyJWT;
