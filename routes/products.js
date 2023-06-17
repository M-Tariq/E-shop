const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
  const productList = await Product.find();
  console.log(productList)
  if (!productList) {
    res.status(500).json({ success: false })
  }
  res.status(200).json({
    productList,
    success: true
  });
})

router.post(`/`, (req, res) => {
  console.log(req)
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock
  })

  product.save().then((createdProduct => {
    res.status(200).json(createdProduct)
  })).catch((err) => {
    res.status(500).json({
      error: err,
      success: false
    })
  })
})

module.exports = router;