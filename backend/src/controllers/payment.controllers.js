const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(process.env.PUBLIC_KEY, process.env.SECRET_KEY);
var request = require('request');
const { findUser, updateUser } = require("../services/user");

exports.payment = async (req, res) => {
  try {
    const { card_number, cvv, expiry_month, expiry_year, amount } = req.body;
    const user = await findUser({ _id: req.user.data[1] });
    // Create a customer in Stripe
    const payload = {
      card_number: card_number,
      cvv: cvv,
      expiry_month: expiry_month,
      expiry_year: expiry_year,
      currency: "NGN",
      amount: amount,
      email: user.email,
      fullname: user.fullName,
      tx_ref: "YOUR_PAYMENT_REFERENCE",
      enckey: process.env.ENCRYPTION_KEY,
    };
    flw.Charge.card(payload).then(async (response) => {
      console.log(response);

      // Add the charge to the trading's bidding array
      user.amount = parseInt(user.amount) + parseInt(amount);

      user.history.push(amount);

      // Save the updated trading document
      await updateUser({ _id: user._id }, user);
      res.status(200).json({ message: "Payment successful", amount: amount });
    });
  } catch (error) {
    console.error("Payment failed:", error);
    res.status(500).json({ error: "Payment failed" });
  }
};

exports.paymentSuccess = async (req, res) => {
  try {
    const user = await findUser({ _id: req.user.data[1] });

    // Add the charge to the trading's bidding array
    user.amount = parseInt(user.amount) + parseInt(req.body.amount);

    user.history.push(req.body.amount);

    // Save the updated trading document
    await updateUser({ _id: user._id }, user);
    res.status(200).json({ amount: req.body.amount });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong!" });
  }
}

exports.getBankCodes = async (req, res) => {
  try {
    var options = {
      'method': 'GET',
      'url': 'https://api.flutterwave.com/v3/banks/NG',
      'headers': {
        'Authorization': `Bearer ${process.env.SECRET_KEY}`
      }
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);

      const allBankDetails = Array.from(JSON.parse(response.body).data);
      const filteredBankDetails = allBankDetails.filter((e) => e.code.length === 3);

      res.status(200).json({
        success: true,
        data: filteredBankDetails
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bank accounts" });
  }
}