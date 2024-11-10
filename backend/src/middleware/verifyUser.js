// src/middleware/verifyUser.js
const jwt = require('jsonwebtoken');
const { errorHandler } = require('./error');



const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(403, "Forbidden"));
    }

    req.user = user;  // Attach the user object to the request
    next();  // Continue to the next middleware or route handler
  });
};

module.exports = { verifyToken };  // Ensure correct export
