const WithdrawModel = require("../models/withdraw")

exports.addWithdraw = async (data) => {
    try {
        return await WithdrawModel.create(data);
    } catch (error) {
        console.log(error);
    }
}

exports.findWithdraw = async (query) => {
    try {
        return await WithdrawModel.findOne(query);
    } catch (error) {
        console.log(error);
    }
}

exports.getWithdraws = async (query) => {
    try {
        return await WithdrawModel.find(query);
    } catch (error) {
        console.log(error);
    }
}


exports.deleteWithdraw = async (query) => {
    try {
        return await WithdrawModel.deleteOne(query);
    } catch (error) {
        console.log(error);
    }
}

exports.updateWithdraw = async (id, data) => {
    try {
        return await WithdrawModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        console.log(error);
    }
}