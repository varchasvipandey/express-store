const express = require("express");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const router = new express.Router();

// SHOW CART
router.post("/cart", auth, async (req, res) => {
  try {
    res.status(200).send(req.user.cart);
  } catch (error) {
    res.send(404).send(error.message);
  }
});

// ADD TO CART
router.post("/cart/:user_id/:product_id", async (req, res) => {
  if (!req.params.user_id || !req.params.product_id)
    res.status(400).send({ error: "Bad Request" });

  try {
    const product = req.params.product_id;
    const user = await User.findOne({
      _id: req.params.user_id
    });
    if (!user) return res.status(404).send({ error: "No user found" });
    // Add product id to user's cart
    user.cart = user.cart.concat({ product });
    await user.save();
    res.status(200).send(user.cart);
  } catch (error) {
    res.send(404).send(error.message);
  }
});

// DELETE FROM CART
router.delete("/cart/:user_id/:product_id", async (req, res) => {
  if (!req.params.user_id || !req.params.product_id)
    res.status(400).send({ error: "Bad Request" });

  try {
    //const product = req.params.product_id;
    const user = await User.findOne({
      _id: req.params.user_id
    });
    if (!user) return res.status(404).send({ error: "No user found" });
    // Add product id to user's cart
    const commons = user.cart.filter(product => {
      if (product.product === req.params.product_id) return product._id;
    });
    const update = user.cart.filter(product => {
      if (product._id !== commons[0]["_id"]) return product;
    });
    user.cart = update;
    await user.save();
    res.status(200).send(user.cart);
  } catch (error) {
    res.send(404).send(error.message);
  }
});

module.exports = router;
