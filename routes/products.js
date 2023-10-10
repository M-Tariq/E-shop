const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get(`/`, productController.getProducts);

router.post(
  `/`,
  productController.uploadProductPhoto,
  productController.saveProduct
);

router.get(`/:id`, productController.getProduct);

router.put(
  `/:id`,
  productController.uploadProductPhoto,
  productController.updateProduct
);

router.delete(`/:id`, productController.deleteProduct);

router.get(`/get/count`, productController.getProductCount);

router.get(`/get/featured`, productController.getFeaturedProduct);

router.put(
  `/gallery-images/:id`,
  productController.uploadProductGalleryPhotos,
  productController.updateGalleryImages
);

module.exports = router;
