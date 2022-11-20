const express = require("express");
const {
  newOrder,
  myOrder,
  getSingleOrder,
  getAllOrder,
  updateOrder,
  DeleteOrder,
} = require("../controllers/orderController");
const {
  isAuthenticated,
  AuthenticatedRoles,
} = require("../middleware.js/Auth");
const router = express.Router();

router.route("/order/new").post(isAuthenticated, newOrder);
router.route("/order/:id").get(isAuthenticated, getSingleOrder);
router.route("/orders/me").get(isAuthenticated, myOrder);
router
  .route("/admin/orders")
  .get(isAuthenticated, AuthenticatedRoles("admin"), getAllOrder);
router
  .route("/admin/order/:id")
  .put(isAuthenticated, AuthenticatedRoles("admin"), updateOrder);
router
  .route("/admin/order/:id")
  .delete(isAuthenticated, AuthenticatedRoles("admin"), DeleteOrder);

module.exports = router;
