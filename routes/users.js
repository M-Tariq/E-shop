const express = require("express");
const bcryptjs = require("bcryptjs");
const { User } = require("../models/user");
const { default: mongoose } = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const router = express.Router();
const userController = require("../controllers/userController");
router.get(`/`, userController.getUsers);

router.post(`/login`, userController.login);

router.get(`/:id`, userController.getUser);

router.put(`/:id`, userController.updateUser);

router.post(`/`, userController.saveUser);

module.exports = router;
