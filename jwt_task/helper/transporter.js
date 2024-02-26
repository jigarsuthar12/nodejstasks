const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: 587,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

module.exports = transporter;
