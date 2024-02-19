const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "heidi.pfeffer@ethereal.email",
    pass: "SaC1ryqHSdHxHD2aXD",
  },
});

module.exports = transporter;
