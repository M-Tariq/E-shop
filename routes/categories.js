const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get(`/`, categoryController?.getCategories);

router.get(`/:id`, categoryController?.getCategory);

router.put(`/:id`, categoryController?.updateCategory);

router.post(`/`, categoryController?.saveCategory);

router.delete(`/:id`, categoryController?.deleteCategory);

module.exports = router;
