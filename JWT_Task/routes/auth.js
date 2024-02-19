const express = require("express");
const authController = require("../controller/auth");
const router = express.Router();

router.get("/", authController.getLogin);

router.get("/signup", authController.getSignUp);

router.post("/signup", authController.postSignUp);

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/newPassword/:token", authController.postNewPassword);

module.exports = router;
