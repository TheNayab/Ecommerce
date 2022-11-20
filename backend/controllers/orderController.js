const Order = require("../models/orderModel");
const Product = require("../models/productModels");

// create new order
exports.newOrder = async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  })
    .then((data) => {
      res.status(200).json({
        success: true,
        data: data,
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

// get single order
exports.getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .then((data) => {
      if (!data) {
        res.status(404).json({
          success: false,
          message: "Order not found with this id",
        });
      } else {
        res.status(200).json({
          success: true,
          data: data,
        });
      }
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

// get loggedin user data
exports.myOrder = async (req, res, next) => {
  const order = await Order.find({
    user: req.user._id,
  })

    .then((data) => {
      res.status(200).json({
        success: true,
        data: data,
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

// get all orders by admin
exports.getAllOrder = async (req, res, next) => {
  const order = await Order.find();

  let totalAmount = 0;
  order.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  return res.status(200).json({
    success: true,
    order,
  });
};

// update order status by admin
exports.updateOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "Delivered") {
    return res.status(400).json({
      success: false,
      message: "Order already delivered",
    });
  }
  order.orderItems.forEach(async (result) => {
    await updateStock(result.product, result.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validareBeforeSave: false });
  res.status(200).json({
    success: true,
    order: order,
  });
};

// reference in upper update method
async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validareBeforeSave: false });
}

// Delete order
exports.DeleteOrder = async (req, res, next) => {
  const order = await Order.findByIdAndRemove(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          success: false,
          message: "Order not found with this id",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Order Successfully deleted",
        });
      }
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
