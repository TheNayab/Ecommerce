const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUSerDetail,
  updateUserPassword,
  updateProfile,
  getAllUSers,
  getSingleUser,
  updateUserRole,
  DeleteUser,
} = require("../controllers/userController");
const {
  isAuthenticated,
  AuthenticatedRoles,
} = require("../middleware.js/Auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticated, getUSerDetail);
router.route("/password/update").put(isAuthenticated, updateUserPassword);
router.route("/me/update").put(isAuthenticated, updateProfile);
router
  .route("/admin/users")
  .get(isAuthenticated, AuthenticatedRoles("admin"), getAllUSers);
router
  .route("/admin/user/:id")
  .get(isAuthenticated, AuthenticatedRoles("admin"), getSingleUser);
router
  .route("/admin/user/:id")
  .put(isAuthenticated, AuthenticatedRoles("admin"), updateUserRole);
router
  .route("/admin/user/:id")
  .delete(isAuthenticated, AuthenticatedRoles("admin"), DeleteUser);

router.route("/logout").get(logoutUser);

module.exports = router;
