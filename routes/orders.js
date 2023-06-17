const { Order } = require('../models/order');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
  const orderList = await Order.find();

  if (!orderList) {
    res.status(500).json({ success: false })
  }
  res.status(200).json({
    orderList,
    success: true
  });
})

router.post(`/`, (req, res) => {
  const newOrder = new Order({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock
  })

  newOrder.save().then((createdOrder => {
    res.status(201).json(createdOrder)
  })).catch((err) => {
    res.status(500).json({
      error: err,
      success: false
    })
  })
})

module.exports = router;