const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    const categoryList = await Category.find();

  if (!categoryList) {
    res.status(404).json({ success: false, message: "Categories not found!" });
  }
  res.status(200).json({
    categoryList,
    success: true
  });
  } catch (error) {
    res.status(500).json({ success: false, message: "Categories not found!" });
    
  }
})

router.get(`/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
  
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found!" });
    }
    res.status(200).json({
      category,
      success: true
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Category not found!" });
  }
})
    

  router.put(`/:id`, async (req, res) => {
   try {
    const id = req.params.id;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    }); 
  
    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found!" });
    }

    res.status(200).json({
      category: updatedCategory,
      success: true,
      message: "Category is updated."
    });
   } catch (error) {
    return res.status(500).json({ success: false, message: "Category not found!" });
    
   }
  })

router.post(`/`, (req, res) => {
  try {
    const newCategory = new Category(req.body);

  newCategory.save().then((createdCategory => {
    res.status(200).json({
        catgory: createdCategory,
        success: true
    
    })
  })).catch((err) => {
    res.status(500).json({
      error: err,
      success: false
    })
  })
  } catch (error) {
    res.status(500).json({
      error: err,
      success: false
    })
  }
});

router.delete(`/:id`, async (req, res) => {
    try {
      const id = req.params.id;
    const deletedCategory = await Category.findByIdAndRemove(id);
  
    if (!deletedCategory) {
      res.status(404).json({ success: false, message: "Category not found!" });
    }
    res.status(200).json({
      message: "The Category is deleted.",
      success: true
    });
    } catch (error) {
      res.status(500).json({ success: false, message: "Category not found!" });
      
    }
  });



module.exports = router;