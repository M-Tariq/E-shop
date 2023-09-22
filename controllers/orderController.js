const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const { default: mongoose } = require("mongoose");

module.exports.getOrders = async (req, res) => {
  try {
    const orderList = await Order.find()
      .populate("user", "name")
      .populate("orderItems");

    if (!orderList) {
      res.status(404).json({ success: false, message: "Order not found!" });
    }
    res.status(200).json({
      orderList,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order not found!" });
  }
};

module.exports.getOrder = async (req, res) => {
  try {
    if (!mongoose?.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Order id is invalid.",
      });
    }

    let order = await Order.findById(req.params.id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      });
    if (!order) {
      res.status(500).json({
        success: false,
        message: "Order not found.",
      });
    }
    res.status(200).json({
      order,
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Order not found.",
      error,
    });
  }
};

module.exports.saveOrder = async (req, res) => {
  let orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;

  let totalPrices = Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product"
      );

      console.log("orderItem:", orderItem);
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  totalPrices = await totalPrices;
  const totalPrice = await totalPrices.reduce((a, b) => a + b, 0);
  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  order = await order.save();
  if (!order)
    return res.status(500).json({
      message: "Something went wrong.",
      success: false,
    });

  return res.status(200).json({
    order,
    success: true,
    message: "Order created successfully.",
  });
};

module.exports.updateOrder = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Order id is invalid.",
      });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      {
        new: true,
      }
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "order not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "order updated successfully.",
      order,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "order not found.",
      error: error,
    });
  }
};

module.exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    await Order.findByIdAndRemove(id).then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        res.status(200).json({
          message: "The Order is deleted.",
          success: true,
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Order not found!" });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

module.exports.getTotalSales = async (req, res) => {
  try {
    const orderList = await Order.find();

    const totalSales = orderList.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    if (!totalSales) {
      res.status(404).json({ success: false, message: "Sales not found!" });
    }
    res.status(200).json({
      totalSales,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Sales not found!", error: error });
  }
};

module.exports.getOrderCount = async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();

    if (!orderCount) {
      res.status(404).json({ success: false, message: "Order not found!" });
    }
    res.status(200).json({
      orderCount,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Order not found!", error: error });
  }
};

module.exports.getUserOrder = async (req, res) => {
  try {
    console.log("triggered");
    const userId = req.params.id;
    console.log("userId:", userId);

    if (!mongoose?.isValidObjectId(userId)) {
      return res.status(404).json({
        success: false,
        message: "Order id is invalid.",
      });
    }

    let orders = await Order.find()
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      });

    if (!orders) {
      res.status(500).json({
        success: false,
        message: "Order not found.",
      });
    }
    res.status(200).json({
      orders,
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Order not found.",
      error,
    });
  }
};
