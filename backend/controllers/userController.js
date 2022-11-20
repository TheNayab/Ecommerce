const User = require("../models/userModel");
const Product = require("../models/productModels");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { error } = require("console");
const { trusted } = require("mongoose");
// Registration method
exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  User.findOne({
    email: req.body.email,
  })
    .exec()
    .then((user) => {
      if (user) {
        res.status(400).json({
          message: "This Email already exist",
        });
      } else {
        let user;
        user = new User({
          name,
          email,
          password,
          avatar: {
            public_id: "this is  a sample id",
            url: "this is a sample url",
          },
        });
        const token = user.getJWTToken();

        const option = {
          expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
        };
        user
          .save()
          .then(() => {
            return res.status(201).cookie("token", token, option).json({
              success: true,
              token: token,
            });
          })
          .catch((err) => {
            if (err.name === "CastError") {
              return res.status(400).json({
                message: "Resource not found",
              });
            }
            return res.status(500).json(err);
          });
      }
    });
};

// Login method
exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both
  if (!email || !password) {
    return res.status(400).json({
      message: "Please Enter Email and Password",
    });
  }
  User.findOne({
    email: req.body.email,
  })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.status(400).json({
            message: "Invalid email or password",
          });
        }
        if (result) {
          const token = user.getJWTToken();

          const option = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };

          return res.status(201).cookie("token", token, option).json({
            success: true,
            token: token,
            user,
          });
        }
        res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({
          message: "Resource not found",
        });
      }
      return res.status(500).json(err);
    });
};

// Logout method
exports.logoutUser = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(201).json({
    success: true,
    message: "Logged Out",
  });
};

// Forgot Password method
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.status(400).json({
      message: "User not found ",
    });
  }
  const resetToken = user.getResetPasswordToken();

  await user.save({
    validateBefore: false,
  });

  const resetPasswordURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordURL} \n\n If you have not requested this email then, please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    return res.status(500).json({
      error: error.message,
    });
  }
};

// Reset Password method
exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    res.status(400).json({
      message: "Reset Password token is Invalid or has been expired",
    });
  }
  if (req.body.password != req.body.confirmPassword) {
    res.status(400).json({
      message: "Password does not match",
    });
  } else {
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
  }

  await user.save();

  res.status(200).json({
    user,
  });
};

// get User Detail method

exports.getUSerDetail = async (req, res, next) => {
  let user;
  user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
};

// Updata Password method

exports.updateUserPassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (err) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }
    if (result) {
      const token = user.getJWTToken();

      const option = {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
      if (req.body.newPassword != req.body.confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Password does not match",
        });
      }
      user.password = req.body.newPassword;

      user.save();
      return res.status(201).cookie("token", token, option).json({
        success: true,
        token: token,
        user,
      });
    }

    res.status(400).json({
      success: false,
      message: "Old password is incorrect",
    });
  });
};

// update profile method
exports.updateProfile = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  let user;
  user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .then((data) => {
      res.status(200).json({
        success: true,
        data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
};

// get all users method

exports.getAllUSers = async (req, res, next) => {
  const user = await User.find()
    .then((data) => {
      res.status(200).json({
        success: true,
        data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
};
// get single user method for admin

exports.getSingleUser = async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: `User not found for ${req.params.id}`,
        });
      } else {
        res.status(200).json({
          success: true,
          data,
        });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({
          message: "An unexpecting error occur",
        });
      }
      return res.status(500).json(err);
    });
};

// update user role by admin
exports.updateUserRole = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  let user;
  user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: `User not found for ${req.params.id}`,
        });
      } else {
        res.status(200).json({
          success: true,
          data,
        });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({
          message: "An unexpecting error occur",
        });
      }
      return res.status(500).json(err);
    });
};

// delete user by admin
exports.DeleteUser = async (req, res, next) => {
  const user = await User.findByIdAndRemove(req.params.id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: `User not found for ${req.params.id}`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `User Deleted successfully`,
        });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(400).json({
          message: "An unexpecting error occur",
        });
      }
      return res.status(500).json(err.message);
    });
};
