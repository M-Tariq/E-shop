const bcryptjs = require("bcryptjs");
const { User } = require("../models/user");
const { default: mongoose } = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");

module.exports.getUsers = async (req, res, next) => {
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
};

module.exports.getUser = async (req, res, next) => {
  async (req, res) => {
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
  };
};

module.exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    if (
      user &&
      (await bcryptjs.compareSync(req.body.password, user.passwordHash))
    ) {
      const token = jsonwebtoken.sign(
        {
          userId: user.id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );
      res.status(200).json({
        success: true,
        message: "Logged In successfully.",
        email: user.email,
        token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Password not matched.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error,
      success: false,
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    let user = null;
    if (mongoose.isValidObjectId(id)) {
      user = User.findById(id);
      let newpassowrd;
      if (req.body.password) {
        newpassowrd = await bcryptjs.hashSync(req.body.password);
      } else {
        newpassowrd = user.passwordHash;
      }

      let newUser = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        passwordHash: newpassowrd,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
      };

      newUser = await User.findByIdAndUpdate(req.params.id, newUser, {
        new: true,
      });

      return res.status(200).json({
        user: newUser,
        success: true,
      });
    }
    return res.status(500).json({ success: false, message: "Invalid Id." });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

module.exports.saveUser = async (req, res) => {
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
};
