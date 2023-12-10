const express = require("express");
const router = express.Router();
const {
  userSignup,
  userLogin,
  userSignupSendOTP,
} = require("../controllers/auth.controllers");

router.post("/signup/send-otp", userSignupSendOTP);
router.post("/signup", userSignup);
router.post("/login", userLogin);

module.exports = router;
