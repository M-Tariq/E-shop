const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const productController = require("../controllers/productController");

const multer = require("multer");
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];

    let uploadError = "Invalid Image type.";
    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, "public/products");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(" ", "-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, productController.getProducts);

router.post(`/`, uploadOptions.single("image"), productController.saveProduct);

router.get(`/:id`, productController.getProduct);

router.put(
  `/:id`,
  uploadOptions.single("image"),
  productController.updateProduct
);

router.delete(`/:id`, productController.deleteProduct);

router.get(`/get/count`, productController.getProductCount);

router.get(`/get/featured`, productController.getFeaturedProduct);

module.exports = router;
