const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  richDescription: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },

  images: [
    {
      type: String,
    },
  ],

  brand: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  countInStock: {
    type: Number,
    min: 0,
    max: 255,
  },

  rating: {
    type: Number,
    default: 0,
  },

  numReviews: {
    type: Number,
    default: 0,
  },

  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
exports.Product = mongoose.model("Product", productSchema);
