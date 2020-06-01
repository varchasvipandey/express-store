const express = require("express");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const router = new express.Router();

// CREATE AN ACCOUNT
router.post("/users", async (req, res) => {
  let user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// LOGIN
router.post("/users/login", async (req, res) => {
  try {
    // FIND USER
    const user = await User.findByCredentails(
      req.body.email,
      req.body.password
    );
    // GENERATE A TOKEN FOR THIS SESSION
    const token = await user.generateAuthToken();
    console.log(user.firstname + " just logged in");
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET CURRENT USER PROFILE
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// GET PROFILE
router.post("/users/:id", async (req, res) => {
  if (!req.params.id) res.status(400).send({ error: "Bad Request" });
  try {
    const user = await User.findOne({
      _id: req.params.id
    });
    if (!user) return res.status(404).send({ error: "No user found" });
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
// UPDATE PROFILE

// LOGOUT
router.patch("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.send("Logged out!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE PROFILE
router.patch("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send("deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
