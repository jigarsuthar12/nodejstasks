const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    contactnum: {
      type: Number,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
