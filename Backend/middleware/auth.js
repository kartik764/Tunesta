// This file is created to use as middleware wherever we need to
// access the token in its decrypted form.

// When a user logs in, we receive a JWT. To associate actions
// (like albums) with a specific user in MongoDB, we use this
// middleware so that each user only accesses their own data.

// Think of it like a security guard at a club: it checks the user’s
// identity, allows entry, and then the user can access different
// sections (like uploading or deleting songs) without repeated checks.

// Along with verification, it also attaches the user information
// to the request object, so the next functions can easily use it.

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticatetoken = (req, res, next) => {
  // 1. Get the authorization header from the frontend
  // It usually looks like: "Bearer <token>"

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify (decode) the token using the secret key
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded user information to req.user
    // so that subsequent middleware/routes can use it
    req.user = decodedToken;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};
export default authenticatetoken;
