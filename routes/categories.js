const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(404).json({ success: false, message: "Categories not found!" });
  }
  res.status(200).json({
    categoryList,
    success: true
  });
})

router.get(`/:id`, async (req, res) => {
    const id = req.params.id;
    const category = await Category.findById(id);
  
    if (!category) {
      res.status(404).json({ success: false, message: "Categories not found!" });
    }
    res.status(200).json({
      category,
      success: true
    });
  })

  router.put(`/:id`, async (req, res) => {
    const id = req.params.id;
    const category = await Category.findByIdAndUpdate(id, req.body, {
        new: true
    }); 
  
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found!" });
    }

    res.status(200).json({
      category,
      success: true,
      message: "Category is updated."
    });
  })

router.post(`/`, (req, res) => {
  const newCategory = new Category(req.body);

  newCategory.save().then((createdCategory => {
    res.status(200).json({
        createdCategory,
        success: true
    
    })
  })).catch((err) => {
    res.status(500).json({
      error: err,
      success: false
    })
  })
});

router.delete(`/:id`, async (req, res) => {
    const id = req.params.id;
    const deletedCategory = await Category.findByIdAndRemove(id);
  
    if (!deletedCategory) {
      res.status(404).json({ success: false, message: "Category not found!" });
    }
    res.status(200).json({
      message: "The Category is deleted.",
      success: true
    });
  });



module.exports = router;