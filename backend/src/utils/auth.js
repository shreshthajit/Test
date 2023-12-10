const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const appConfig = require("../../config");

exports.generateJWTToken = (user) => {
    return jsonwebtoken.sign(
        {
            data: [user.phoneNumber, user._id],
            admin: user.admin,
        },
        "" + appConfig.jwt.key
    );
}

exports.hashValue = async (value) => {
    const salt = bcrypt.genSaltSync(10);
    return await bcrypt.hash(value, salt);
}

exports.compareHash = async (oldValue, value) => {
    return await bcrypt.compare(oldValue, value);
}