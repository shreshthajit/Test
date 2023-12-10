const ErrorResponse = require("../utils/errorResponse");
const { findUser, addUser } = require("../services/user");
const { generateJWTToken, hashValue, compareHash } = require("../utils/auth");
const sendSms = require("../utils/send-sms");

exports.userSignupSendOTP = async (req, res, next) => {
  try {
    req.body.password = "ochuba4444";
    let user = await findUser({ phoneNumber: req.body.phoneNumber });
    if (!user) {
      const hash = await hashValue(req.body.password);
      user = await addUser({ ...req.body, password: hash });
      if (!user) {
        return next(new ErrorResponse("Send OTP failed failed", 400));
      }
    }
    const otpVerifyToken = `${Math.floor(100000 + (Math.random() * 900000))}`;
    user.otpVerifyToken = otpVerifyToken;
    user.otpVerifyTokenExpireTime = Date.now() + 3600000; // 1 hour
    await user.save();

    const body = `${otpVerifyToken} is your OTP to register`;

    sendSms(body, req.body.phoneNumber);
    res.status(200).json({
      success: true,
      message: `OTP sent to ${req.body.phoneNumber} successfully`
    })
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(err, 400));
  }
};

exports.userSignup = async (req, res, next) => {
  try {
    const user = await findUser({
      phoneNumber: req.body.phoneNumber,
      otpVerifyToken: req.body.code,
      otpVerifyTokenExpireTime: { $gt: Date.now() }
    })
    if (!user) {
      return next(new ErrorResponse("Invalid OTP or time expired", 400));
    }
    const token = generateJWTToken(user);
    user.password = undefined;
    return res.status(200).json({
      success: true,
      message: "Successfully Logged in",
      token: token,
      user: user,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(err, 400));
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await findUser({ email });
    if (!result) {
      return next(new ErrorResponse("Incorrect Phone Number", 200));
    }
    const doesPasswordMatch = await compareHash(password, result.password)
    if (!doesPasswordMatch) {
      return next(new ErrorResponse("Incorrect password", 400));
    }
    const token = generateJWTToken(result);
    result.password = undefined;
    return res.status(200).json({
      success: true,
      message: "Successfully Logged in",
      token: token,
      user: result,
    });

  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
};

