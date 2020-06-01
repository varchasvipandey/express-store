const express = require("express");
const Product = require("../models/product");
const multer = require("multer");
const router = new express.Router();

//config multer
const upload = multer({
  limits: {
    fileSize: 1000000 //500KB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error("File must be an image"));
    }
    cb(undefined, true);
  }
});

//add product
router.post(
  "/dev-product",
  upload.single("image"),
  async (req, res) => {
    let productData = {
      ...req.body,
      image: req.file.buffer
    };
    let product = new Product(productData);
    try {
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      if (error.errmsg) error.message = error.errmsg;
      res.status(400).send(error.message);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//get products
router.post("/get-products", async (req, res) => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//get image
router.get("/products/:id/image", async (req, res) => {
  res.set("Content-Type", "image/jpg");
  try {
    const product = await Product.findOne({
      _id: req.params.id
    });
    if (!product)
      return res.status(404).send("/static/img/products/no_image.jpg");

    res.status(200).send(product.image);
  } catch (error) {
    res.send(404).send(error.message);
  }
});

//get a product for preview
router.post("/products/preview/:id", async (req, res) => {
  if (!req.params.id) res.status(400).send({ error: "Bad Request" });
  try {
    const product = await Product.findOne({
      _id: req.params.id
    });
    if (!product) return res.status(404).send({ error: "Not Found" });
    res.status(200).send(product);
  } catch (error) {
    res.send(404).send(error.message);
  }
});

//get a product for cart preview
router.post("/products/cart-preview/:id", async (req, res) => {
  if (!req.params.id) res.status(400).send({ error: "Bad Request" });
  try {
    const product = await Product.findOne(
      {
        _id: req.params.id
      },
      { name: 1, price: 1 }
    );
    if (!product) return res.status(404).send({ error: "Not Found" });
    res.status(200).send(product);
  } catch (error) {
    res.send(404).send(error.message);
  }
});

//get products for home screen
router.post("/get-home-products", async (req, res) => {
  try {
    const products = await Product.find()
      .limit(4)
      .sort({ updatedAt: -1 });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//update products
router.patch(
  "/dev-product/:id",
  async (req, res) => {
    const updates = Object.keys(req.body);
    try {
      const product = await Product.findOne({
        _id: req.params.id
      });
      if (!product) return res.status(404).send();
      updates.forEach(update => (product[update] = req.body[update]));
      await product.save();
      res.status(201).send(product);
    } catch (error) {
      res.send(500).send(error.message);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//delete products
router.delete("/dev-product/:id", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id
    });
    if (!product) return res.status(404).send();
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
