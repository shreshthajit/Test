const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
  Amount: {
    type: String,
    default: "",
    required: [true, "Please enter Amount"],
  },
  BBAN: {
    type: String,
    default: "",
    required: [true, "Please enter Bank Account Number"],
  },
  BSB: {
    type: String,
    default: "",
    required: [true, "Please enter Bank Code"],
  },
  Status: {
    type: String,
    default: "",
  },
  User: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    phoneNumber: String
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Withdraw", withdrawSchema);
