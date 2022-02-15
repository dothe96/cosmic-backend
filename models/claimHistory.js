const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const claimHistorySchema = new Schema({
    user: { type: String, required: true },
    amount: { type: Number }
},  { timestamps: { createdAt: 'createdAt' } });

const ClaimHistoryModel = mongoose.model("ClaimHistory", claimHistorySchema);

const saveUserHistory = async (user, amount) => {
    const model = new ClaimHistoryModel({
        user: user,
        amount: amount,
    });

    try{
        return await model.save();
    } catch (err) {
        console.log(err);
        return;
    }
}

const countUserHistoryToday = async (user) => {
    try {
        return await ClaimHistoryModel.countDocuments({
            user: user,
            createdAt: {
                $gte: moment.utc().startOf("day").format(),
                $lte: moment.utc().endOf("day").format()
            }
        });
    } catch (err) {
        console.log(err);
        return -1;
    }
}

module.exports = {
    ClaimHistoryModel: ClaimHistoryModel,
    saveUserHistory: saveUserHistory,
    countUserHistoryToday: countUserHistoryToday
}