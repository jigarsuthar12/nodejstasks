const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(authRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    app.listen(5000, () => {
      console.log(`good to go with express.js`);
    });
  })
  .catch((err) => console.error(err));
