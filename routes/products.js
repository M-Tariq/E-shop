const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const productController = require("../controllers/productController");

router.get(`/`, productController.getProducts);

router.post(`/`, productController.saveProduct);

router.get(`/:id`, productController.getProduct);

router.put(`/:id`, productController.updateProduct);

router.delete(`/:id`, productController.deleteProduct);

router.get(`/get/count`, productController.getProductCount);

router.get(`/get/featured`, productController.getFeaturedProduct);

module.exports = router;
