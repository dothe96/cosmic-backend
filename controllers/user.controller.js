const UserInfo = require('../models/userInfo');

const getUserInfo = async (user) => {
    const userInfoData = await UserInfo.getUserInfo(user);
    return userInfoData;
}

module.exports = {
    getUserInfo: getUserInfo
}