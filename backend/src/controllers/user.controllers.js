const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const { findUser, updateUser, getUsers } = require("../services/user");
const { hashValue, compareHash } = require("../utils/auth");

exports.getOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUser({ _id: req.user.data[1] });

    const otp = `${Math.floor(1000 + (Math.random() * 9000))}`;
    const hashedOTP = await hashValue(otp);

    user.verificationOttp = hashedOTP;
    user.verificationOttpExpire = Date.now() + 3600000;
    await user.save();

    const html = `<p> Enter <b> ${otp} </b> in the app to verify your email address. </p>`;
    sendEmail(
      email,
      "OTP Verification Service",
      html
    )

    res.status(200).json({
      success: true,
      message: `OTP sent to ${email} successfully`
    })
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
}

exports.verifyOtp = async (req, res, next) => {
  try {
    const { code, email } = req.body;
    const user = await findUser({ _id: req.user.data[1] });
    if (!user) {
      return next(new ErrorResponse("User not found", 400));
    }

    const verifiedUser = await findUser({
      phoneNumber: user.phoneNumber,
      verificationOttpExpire: { $gt: Date.now() }
    })
    if (!verifiedUser) {
      return next(new ErrorResponse("User not found", 400));
    }

    const isOTPmatched = await compareHash(code, verifiedUser.verificationOttp);
    if (!isOTPmatched) {
      return next(new ErrorResponse("Code is invalid or has been expired", 400));
    }

    verifiedUser.verificationOttp = null;
    verifiedUser.verificationOttpExpire = null;
    verifiedUser.email = email;
    await verifiedUser.save();

    res.status(200).json({
      success: true,
      message: `Successfully updated`
    })
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
}



exports.userUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await updateUser(id, req.body);
    if (!result) {
      return next(new ErrorResponse("Update failed", 400));
    }

    return res.status(200).json({
      success: true,
      message: "Successfully Update the user",
      user: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: err.message,
      user: [],
    });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await getUsers({});
    if (users) {
      return res.status(200).json({
        success: true,
        message: "Got All Users Successfully",
        data: users,
      });
    }

    return res.status(200).json({
      success: false,
      message: "No User Found",
      data: [],
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

exports.getSingleUser = async (req, res, next) => {
  try {
    let user = await findUser({ _id: req.user.data[1] });
    //console.log(user)
    user.password = undefined;
    if (user) {
      return res.status(200).json({
        success: true,
        message: "user found",
        data: user,
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "user not found",
      data: user,
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};
