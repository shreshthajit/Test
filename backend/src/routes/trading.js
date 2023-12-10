const express = require("express");
const router = express.Router();

const {
  payment,
  paymentSuccess,
  getBankCodes
} = require("../controllers/payment.controllers");
const {
  Bid,
  Sell,
} = require("../controllers/bid.controllers");

const {
  withdraw,
  findWithdraws,
  withdrawComplete,
} = require("../controllers/withdraw.controllers");

const {
  createTrading,
  findTradings,
  findAllTradings,
  findByIdAndDelete,
  calculateResult,
  findTradingById,
} = require("../controllers/trading.controllers");
const checkAuth = require("../middleware/check-auth");
const { uploadImage } = require("../internal/multer");

router.get("/", findAllTradings);
router.post("/payment", checkAuth, payment);
router.get("/bankcodes", getBankCodes);
router.post("/paymentsuccess", checkAuth, paymentSuccess);
router.get("/withdraw", findWithdraws);
router.post("/withdraw", checkAuth, withdraw);
router.put("/withdraw/complete/:id", checkAuth, withdrawComplete);
router.post("/sell/:id", checkAuth, Sell);
router.post("/bid/:id", checkAuth, Bid);
router.post("/result/:id", calculateResult);
router.get("/single/:id", findTradingById);
router.get("/:type", findTradings);
router.post("/:type", uploadImage.single("image"), createTrading);
router.delete("/:id", findByIdAndDelete);

module.exports = router;
