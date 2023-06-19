const { Product } = require('../models/product');
const { Category } = require('../models/category');
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

router.post(`/`, async(req, res) => {

  const category = await Category.findById(req.body.category);
  if(!category){
    return res.status(400).json({
      message: "Invalid category."
    })
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
  })

  product = await product.save();
  if(!product)
  return res.status(500).json({
    message: "Something went wrong.",
    success: false
  })

  return res.status(200).json({
    product,
    success: true,
    message: "Product created successfuly."
  })
})

module.exports = router;