const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: true
    },
    description: {
      type: String,
      unique: true,
      trim: true,
      required: true
    },
    category: {
      type: String,
      trim: true,
      default: "miscellanous"
    },
    price: {
      type: Number,
      required: true
    },
    discountPrice: {
      type: Number,
      default: 0
    },
    image: {
      type: Buffer,
      required: true
    },
    stock: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
