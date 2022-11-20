const express = require("express");
const products = require("./routes/productRoute");
const cookieParser = require("cookie-parser");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", products);
app.use("/api/v1", user);
app.use("/api/v1", order);
module.exports = app;
