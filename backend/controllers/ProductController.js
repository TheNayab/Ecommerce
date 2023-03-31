const Product = require("../models/productModels");
const ApiFeatures = require("../utils/apifeachers");
// Create Product-->Admin Only
exports.createProduct = async (req, res, next) => {
  req.body.user = req.user.id;
  let products;
  products = await Product.create(req.body)
    .then((data) => {
      return res.status(201).json({
        success: true,
        data,
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

// Get All

exports.getAllProducts = async (req, res, next) => {
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    let products=await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  //const products = await apiFeature.query;

  return res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductsCount
  });
};
// Updata --> Admin only

exports.updateProducts = async (req, res, next) => {
  const id = req.params.id;
  let products;
  products = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .then((data) => {
      if (data) {
        return res.status(201).json({
          success: true,
          data,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "PRRODUCT NOT FOUND",
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

// Delete Product --> Admin Only

exports.deleteProducts = async (req, res, next) => {
  const id = req.params.id;
  let products;
  products = await Product.findByIdAndRemove(id)
    .then((data) => {
      if (data) {
        return res.status(201).json({
          success: true,
          message: "PRODUCT DELETED SUCCESSFULLY",
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "PRRODUCT NOT FOUND",
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

// Get Product Detail
exports.getProductDetails = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(400).json({
      success: false,
      message: "PRRODUCT NOT FOUND",
    });
  }
  return res.status(201).json({
    success: true,
    product,
  });
};

// rating method

exports.UserRating = async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment: comment,
  };

  const product = await Product.findById(productId);

  const isreviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isreviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let count = 0;
  product.reviews.forEach((rev) => {
    count += rev.rating;
  });

  product.ratings = count / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
};

//  Get all reviews of users

exports.getAllReviews = async (req, res, next) => {
  const product = await Product.findById(req.query.id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          success: false,
          message: `Product not found`,
        });
      } else {
        res.status(200).json({
          success: true,
          reviews: data.reviews,
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

//  Deleting reviews

exports.DeleteReviews = async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product not found`,
    });
  } else {
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
    let count = 0;
    reviews.forEach((rev) => {
      count += rev.rating;
    });

    const ratings = count / reviews.length;
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({
      success: true,
    });
  }
};
