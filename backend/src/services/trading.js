const TradingModel = require("../models/trading")

exports.addNewTrading = async (data) => {
    try {
        return await TradingModel.create(data);
    } catch (error) {
        console.log(error);
    }
}

exports.findTrading = async (query) => {
    try {
        return await TradingModel.findOne(query);
    } catch (error) {
        console.log(error);
    }
}

exports.deleteTrading = async (id) => {
    try {
        return await TradingModel.findByIdAndDelete(id);
    } catch (error) {
        console.log(error);
    }
}

exports.getTradings = async (query) => {
    try {
        return await TradingModel.find(query);
    } catch (error) {
        console.log(error);
    }
}

exports.updateTrading = async (id, data) => {
    try {
        return await TradingModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        console.log(error);
    }
}