const commonUtils = require('../utils/commonUtils');
const claimHistory = require('../models/claimHistory');
const UserInfo = require('../models/userInfo');
const claimState = require('../storage/state').claimState;

const getRamdomAmount = () => {
    //ramdom from 1 to 100;
    return commonUtils.getRamdomInt(1, 100);
};

const getClaimState = async (user) => {
    const count = await claimHistory.countUserHistoryToday(user);
    if (count == 0) {
        return claimState.unclaimed;
    } else if (count > 0) {
        return claimState.claimed;
    } else {
        return claimState.unknow;
    }
}

const doClaimToken = async (user) => {
    const result = {
        state: claimState.unknow
    }
    const amount = getRamdomAmount();
    const state = await getClaimState(user);
    result.state = state;
    if (state === claimState.unclaimed) {
        const claimHistoryData = await claimHistory.saveUserHistory(user, amount);
        const useInfoData = await UserInfo.upsertUserInfo(user, amount, false);
        result.data = claimHistoryData;
        if (claimHistoryData && useInfoData) {
            result.state = claimState.claimed;
        } else {
            result.state = claimState.unknow;
        }
    }
    return result;
};

module.exports = {
    getClaimState: getClaimState,
    doClaimToken: doClaimToken
}