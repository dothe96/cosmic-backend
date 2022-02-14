const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
    user: { type: String, required: true},
    totalToken: { type: Number },
    restricted: { type: Boolean },
    lastIn: { type: Date }
});

const UserInfoModel = mongoose.model("UserInfo", userInfoSchema);

const upsertUserInfo = async (user, amount, restricted) => {
    try {
        return await UserInfoModel.updateOne({
            user: user
        }, {
            user: user,
            $inc: { totalToken: amount },
            restricted: restricted,
            lastIn: moment().toDate()
        }, {
            upsert: true
        });
    } catch (err) {
        console.log(err);
        return;
    }
}

const getUserInfo = async (user) => {
    try {
        return await UserInfoModel.findOne({
            user: user
        });
    } catch (err) {
        console.log(err);
        return;
    }
}

module.exports = {
    UserInfoModel: UserInfoModel,
    upsertUserInfo: upsertUserInfo,
    getUserInfo: getUserInfo
}