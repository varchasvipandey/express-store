const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("./db/mongoose");

//routes
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const cartRoute = require("./routes/cart");

const app = express();
const port = process.env.PORT;

//parse form body
app.use(bodyParser.urlencoded({ extended: true }));

//static routes
app.use("/static", express.static(__dirname + "/public/static"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.get("/products", async (req, res) => {
  res.sendFile(path.join(__dirname + "/public/pages/products.html"));
});
app.get("/products/preview", async (req, res) => {
  res.sendFile(path.join(__dirname + "/public/pages/preview.html"));
});
app.get("/cart", async (req, res) => {
  res.sendFile(path.join(__dirname + "/public/pages/cart.html"));
});

app.use(express.json());
//access routes
app.use(productRoute);
app.use(userRoute);
app.use(cartRoute);

app.listen(port, () => console.log(`Server started at port ${port}`));
