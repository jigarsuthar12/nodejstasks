const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const secretkey = "jigar";
app.use(cookieParser());

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "heidi.pfeffer@ethereal.email",
    pass: "SaC1ryqHSdHxHD2aXD",
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

      const token = jwt.sign({ email }, secretkey, {
        expiresIn: "1h",
      });
      return res.status(200).send(token);
    })
    .then((result) => {
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
            <p>Click this <a href = 'http://localhost:5000/reset/${token}'>link</a> to set a new password</p>
          `,
      });
    });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ userId: User._id })
    .then((user) => {
      if (!user) {
        console.log("not getting user");
      }

      res.cookie("token", token);
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "Reset Password",
        userId: user._id.toString(),
      });
    })
    .catch((err) => console.error(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const token = req.Cookies;

  const decoded = jwt.verify(token, secretkey);

  let resetUser;
  User.findOne({ userId: decoded._id })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      return resetUser.save();
    })
    .then((result) => {
      console.log("user is updated!!");
      res.redirect("/login");
    })
    .catch((err) => console.error(err));
};
