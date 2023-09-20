const { Product } = require("../models/product");
const { Category } = require("../models/category");
const { default: mongoose } = require("mongoose");

module.exports.getProducts = async (req, res) => {
  try {
    let filters = {};
    if (req.query.categories) {
      filters = { category: req.query.categories.split(",") };
    }
    const productList = await Product.find(filters).populate("category");
    if (!productList) {
      return res.status(500).json({ success: false });
    }
    res.status(200).json({
      productList,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error, message: "Invalid category" });
  }
};

module.exports.getProduct = async (req, res) => {
  try {
    if (!mongoose?.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Product id is invalid.",
      });
    }

    const product = await Product.findById(req.params.id).populate([
      "category",
    ]);
    if (!product) {
      res.status(500).json({
        success: false,
        message: "Product not found.",
      });
    }
    res.status(200).json({
      product,
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Product not found.",
      error,
    });
  }
};

module.exports.saveProduct = async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).json({
      message: "Invalid category.",
    });
  }
  let product = new Product({
    name: req.body.name,
    image: req.body.image,
    images: req.body.images,
    countInStock: req.body.countInStock,
    description: req.body.description,
    richDescription: req.body.richDescription,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    isFeatured: req.body.isFeatured,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    dateCreated: req.body.dateCreated,
  });

  product = await product.save();
  if (!product)
    return res.status(500).json({
      message: "Something went wrong.",
      success: false,
    });

  return res.status(200).json({
    product,
    success: true,
    message: "Product created successfully.",
  });
};

module.exports.updateProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Product id is invalid.",
      });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
      error: error,
    });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProduct = await Product.findByIdAndRemove(id);

    if (!deletedProduct) {
      res.status(404).json({ success: false, message: "Product not found!" });
    }
    res.status(200).json({
      message: "The Product is deleted.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Product not found!" });
  }
};

module.exports.getProductCount = async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();
    if (!productsCount) {
      return res.status(404).json({
        success: false,
        message: "No product is found.",
      });
    }

    return res.status(200).json({
      success: true,
      productsCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "Product not found.",
      error,
    });
  }
};

module.exports.getFeaturedProduct = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    const countFeaturedProduct = await Product.find({
      isFeatured: true,
    }).countDocuments();
    // const countFeaturedProduct = await Product.find({
    //   isFeatured: true,
    // }).count();
    if (!featuredProducts) {
      return res.status(404).json({
        success: false,
        message: "No product found.",
      });
    }

    return res.status(200).json({
      success: true,
      featuredProducts,
      countFeaturedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "Product not found.",
      error,
    });
  }
};
