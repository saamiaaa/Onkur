
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const token = req.cookies.onkur_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to access this resource.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Your session is invalid or has expired. Please sign in again.",
    });
  }
};

module.exports = { protect };
