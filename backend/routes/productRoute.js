const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProducts,
  deleteProducts,
  getProductDetails,
  UserRating,
  getAllReviews,
  DeleteReviews,
} = require("../controllers/ProductController");
const {
  isAuthenticated,
  AuthenticatedRoles,
} = require("../middleware.js/Auth");

const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/admin/product/new")
  .post(isAuthenticated, AuthenticatedRoles("admin"), createProduct);
router
  .route("/admin/products/:id")
  .put(isAuthenticated, AuthenticatedRoles("admin"), updateProducts);
router
  .route("/admin/products/:id")
  .delete(isAuthenticated, AuthenticatedRoles("admin"), deleteProducts);
router.route("/products/:id").get(getProductDetails);
router.route("/review").put(isAuthenticated, UserRating);
router.route("/reviews").get(getAllReviews);
router.route("/reviews").delete(isAuthenticated, DeleteReviews);

module.exports = router;
