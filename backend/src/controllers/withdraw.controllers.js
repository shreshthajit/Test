const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(process.env.PUBLIC_KEY, process.env.SECRET_KEY);
const ErrorResponse = require("../utils/errorResponse");
const crypto = require("crypto");
const { findUser, updateUser } = require("../services/user");
const { addWithdraw, deleteWithdraw, getWithdraws, findWithdraw, updateWithdraw } = require("../services/withdraw");

exports.withdraw = async (req, res, next) => {
  try {
    const user = await findUser({ _id: req.user.data[1] });

    if (req.body.Amount > user.profit || req.body.Amount < 100) {
      return res.status(400).json({
        success: false,
        message: "Amount can neither be more than earning amount nor be less than 100",
        data: [],
      })
    }

    req.body.User = { id: req.user.data[1], phoneNumber: user.phoneNumber };
    const result = addWithdraw({
      ...req.body,
      Status: "pending"
    });
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Failed to Create the Withdraw",
        data: [],
      });
    }

    const details = {
      account_number: result.BBAN,
      account_bank: result.BSB
    }

    const accountIsVerify = await flw.Misc.verify_Account(details);
    if (accountIsVerify.status === "error") {
      await deleteWithdraw({ _id: result._id });
      return res.status(200).json({
        success: false,
        message: "Sorry account number is invalid"
      })
    }

    user.amount = parseInt(user.amount) - parseInt(req.body.Amount);
    user.profit = parseInt(user.profit) - parseInt(req.body.Amount);
    await updateUser({ _id: user._id }, user);

    return res.status(200).json({
      success: true,
      message: `Successfully Created the Withdraw`,
      withdraw: result
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: err.message,
      data: [],
    });
  }
};

exports.findWithdraws = async (req, res, next) => {
  try {
    const withdraws = await getWithdraws({});
    if (withdraws) {
      return res.status(200).json({
        success: true,
        message: "Got Data Successfully",
        data: withdraws.reverse(),
      });
    }

    return res.status(200).json({
      success: false,
      message: "No Data Found",
      data: [],
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      message: err.message,
      data: [],
    });
  }
};

exports.withdrawComplete = async (req, res, next) => {
  try {
    const result = await findWithdraw({ _id: req.params.id });
    if (!result) {
      return next(new ErrorResponse("Failed to fetch the withdraw", 400));
    }

    const verifiedDetails = {
      account_bank: result.BSB,
      account_number: result.BBAN,
      amount: result.Amount,
      currency: "NGN",
      narration: "Payment for things",
      reference: crypto.randomBytes(16).toString("hex"),
    }
    flw.Transfer.initiate(verifiedDetails)
      .then(async (resp) => {
        if (resp.status === "success") {
          await flw.Transfer.get_a_transfer({ id: String(resp.data.id) });
          result.Status = "complete";
          await updateWithdraw({ _id: result._id }, result);

          return res.status(200).json({
            success: true,
            message: "Successfully Update the Withdraw",
            user: result,
          });
        } else {
          return res.status(200).json({
            success: false,
            message: "Some error occurred during transfer"
          })
        }
      })
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(err, 400));
  }
};
