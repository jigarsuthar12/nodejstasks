const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const transporter = require("../helper/transporter");
const secretkey = "jigar";

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
  const { email, password, firstName, lastName, contact, address } = req.body;
  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        res.status(401).send("Email exist already");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            firstname: firstName,
            lastname: lastName,
            contactnum: contact,
            password: hashedPassword,
            address: address,
          });
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
  const { email, password } = req.body;
  User.findOne({ email })
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
  const { email } = req.body;
  User.findOne({ email })
    .then((user) => {
      const userId = user._id;
      if (!user) {
        return res.status(401).send("Could not find user!!");
      }
      token = jwt.sign({ email, userId }, secretkey, {
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
  const { token } = req.params;
  res.render(`auth/newPassword`, {
    path: "/newPassword",
    pageTitle: "Reset Password",
    token: token,
  });
};

exports.postNewPassword = (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;

  const decoded = jwt.verify(token, secretkey);
  if (decoded) {
    console.log("user is verified");
    let resetUser;
    User.findOne({ _id: decoded.userId })
      .then((user) => {
        resetUser = user;
        return bcrypt.hash(password, 12);
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
  } else {
    console.error("user is not verified");
  }
};
