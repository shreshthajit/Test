const UserModel = require("../models/user")

exports.addUser = async (data) => {
    try {
        return await UserModel.create(data);
    } catch (error) {
        console.log(error);
    }
}

exports.findUser = async (query) => {
    try {
        return await UserModel.findOne(query);
    } catch (error) {
        console.log(error);
    }
}

exports.getUsers = async (query) => {
    try {
        return await UserModel.find(query);
    } catch (error) {
        console.log(error);
    }
}

exports.updateUser = async (id, data) => {
    try {
        return await UserModel.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        console.log(error);
    }
}