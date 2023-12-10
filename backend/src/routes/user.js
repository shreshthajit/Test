const express = require("express");
const router = express.Router();
const {
  userUpdate,
  getAllUsers,
  getSingleUser,
  getOtp,
  verifyOtp
} = require("../controllers/user.controllers");
const checkAuth = require("../middleware/check-auth");

router.put("/update/:id", userUpdate);
router.get("/user", checkAuth, getSingleUser);
router.get("/getallusers", getAllUsers);
router.post("/getottp", checkAuth, getOtp);
router.put("/verifyottp", checkAuth, verifyOtp);

module.exports = router;
