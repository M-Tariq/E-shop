const { Order } = require("../models/order");
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
router.post(`/`, orderController.saveOrder);

router.get(`/`, orderController.getOrders);

router.get(`/:id`, orderController.getOrder);

router.put(`/:id`, orderController.updateOrder);

router.delete(`/:id`, orderController.deleteOrder);

router.get(`/get/total-sales`, orderController.getTotalSales);

router.get(`/get/order-count`, orderController.getOrderCount);

router.get(`/get/user-orders/:id`, orderController.getUserOrder);

module.exports = router;
