const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const secretkey = "jigar*543";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "cheyenne.kshlerin@ethereal.email",
    pass: "YVVAaWSVrtTJUmYWAa",
  },
});
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login Page",
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "SignUp Page",
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        res.status(401).send("Email exist already");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({ email: email, password: hashedPassword });
          return user.save();
        })
        .then((result) => {
          res.status(200).send("User Successfully Created");
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).send("User does not exist");
      }

      const passwordMatch = bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send("Password Does not match");
      }

      const token = jwt.sign({ userId: user._id }, secretkey, {
        expiresIn: "1h",
      });

      return res.status(200).send(token);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/login");
    })
    .catch((err) => console.error(err));
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Page",
  });
};

exports.postReset = (req, res, next) => {
  let token = "";
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).send("Could not find user!!");
      }
      token = jwt.sign({ userId: user._id }, secretkey, {
        expiresIn: "1h",
      });

      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    })
    .then((result) => {
      res.redirect("/");
      transporter.sendMail({
        from: '"shop@node-complete.com" <jigar@gmail.com>',
        to: req.body.email,
        subject: "Password reset",
        text: "Password Reset",
        html: `
            <p>You requested a password reset</p>
            <p>Click this <a href = "http://localhost:3000/reset/${token}">link</a> to set a new password</p>
          `,
      });
    });
};
