const { Product } = require("../models/product");
const { Category } = require("../models/category");
const { default: mongoose } = require("mongoose");
const path = require("path");
require("dotenv/config");
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE;

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/products");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const fileNameWithoutExtension = path.basename(
      fileName,
      path.extname(fileName)
    );
    const fileExtension = path.extname(file.originalname);
    cb(null, `${fileNameWithoutExtension}-${Date.now()}${fileExtension}`);
  },
});

const imageFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Only image file is allowed", 400), false);
  }
};

const uploadOptions = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: imageFilter,
});

// for single product image
exports.uploadProductPhoto = uploadOptions.single("image");
// for product gallery images
exports.uploadProductGalleryPhotos = uploadOptions.array("images", 3);

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
    res.status(200).json(productList);
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
    res.status(200).json(product);
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

  //image validation
  if (!req.file) {
    return res.status(400).json({
      message: "No image in the request.",
    });
  }

  const filename = `${req.protocol}://${req.get("host")}/${req.file.path}`;
  let product = new Product({
    name: req.body.name,
    image: filename,
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
    const productId = req.params.id;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(404).json({
        success: false,
        message: "Product id is invalid.",
      });
    }

    const product = await Product.findById(productId);
    const file = req.file;

    Object.assign(product, req.body);

    if (file) {
      filename = `${req.protocol}://${req.get("host")}/${req.file.path}`;
      Object.assign(product, { image: filename });
    }

    // Save the updated product
    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "An error occurred while updating the product.",
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
    return res.status(404).json({
      success: false,
      message: "Product not found.",
      error,
    });
  }
};

module.exports.updateGalleryImages = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.isValidObjectId(productId)) {
      return res.status(404).json({
        success: false,
        message: "Product id is invalid.",
      });
    }

    let imagesPaths = [];
    const files = req.files;
    if (files) {
      files.map((file) => {
        let filename = `${req.protocol}://${req.get("host")}/${file.path}`;
        imagesPaths.push(filename);
      });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) {
      return res.status(500).send("Product can't be updated.");
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "An error occurred while updating the product.",
      error: error,
    });
  }
};
