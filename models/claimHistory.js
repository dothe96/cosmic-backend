const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const claimHistorySchema = new Schema({
    user: { type: String, required: true },
    amount: { type: Number }
});

const ClaimHistoryModel = mongoose.model("ClaimHistory", claimHistorySchema);

const saveUserHistory = async (user, amount) => {
    const model = new ClaimHistoryModel({
        user: user,
        amount: amount
    });

    try{
        return await model.save();
    } catch (err) {
        console.log(err);
        return;
    }
}

const countUserHistoryToday = async (user) => {
    let today = moment().startOf('day');
    try {
        return await ClaimHistoryModel.countDocuments({
            user: user,
            createdAt: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
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