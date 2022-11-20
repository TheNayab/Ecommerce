const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
exports.isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      res.status(401).json({
        message: "Please Login to Access this Resource",
      })
    );
  }
  const decodeData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodeData.id);
  next();
};

exports.AuthenticatedRoles = (...roles) => {
  return (req,res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({
          success:false,
          message: `Role:${req.user.role} is not allowed to access this resouce`,
        })
      );
    }
    next();
  };
};
