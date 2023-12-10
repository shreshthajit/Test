const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const appConfig = require('../../config');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return next(new ErrorResponse('Token Absent', 401))
        }
        const decoded = jwt.verify(token, "" + appConfig.jwt.key);
        req.user = decoded;
        return next();
    } catch (err) {
        return next(new ErrorResponse(err, 400))
    }
};