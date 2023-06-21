const express = require("express");
const bcryptjs = require("bcryptjs");
const { User } = require("../models/user");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");

    if (!users) {
      res.status(500).json({ success: false });
    }
    res.status(200).json({
      users,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    if (mongoose.isValidObjectId(id)) {
      const users = await User.findById(id).select("-passwordHash");

      if (!users) {
        return res.status(500).json({ success: false });
      }
      return res.status(200).json({
        users,
        success: true,
      });
    }
    return res.status(500).json({ success: false, message: "Invalid Id." });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

router.put(`/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    let user = null;
    if (mongoose.isValidObjectId(id)) {
      user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      if (!user) {
        return res.status(500).json({ success: false });
      }
      return res.status(200).json({
        user,
        success: true,
      });
    }
    return res.status(500).json({ success: false, message: "Invalid Id." });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

router.post(`/`, async (req, res) => {
  try {
    let salt = bcryptjs.genSaltSync(10);
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      passwordHash: bcryptjs.hashSync(req.body.password, salt),
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      country: req.body.country,
      isAdmin: req.body.isAdmin,
    });

    newUser = await newUser.save();
    if (!newUser) {
      return res.status(500).json({
        success: false,
      });
    }
    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      success: false,
    });
  }
});

module.exports = router;
