const commonUtils = require('../utils/commonUtils');
const claimHistory = require('../models/claimHistory');
const UserInfo = require('../models/userInfo');
const claimState = require('../storage/state').claimState;
const Web3 = require('web3');
require('dotenv').config();

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

const getAllTokens = async (user) => {
    const result = {
        success: false,
        user: user,
        amount: 0,
        signature: ''
    }
    const userInfo = await UserInfo.getUserInfo(user);
    if (userInfo) {
        result.amount = userInfo.totalToken;
        result.signature = createSignature({ recipient: user, amount: result.amount });
        result.success = true;
    }
    return result;
}

const updateClaimAllState = async (user) => {
    return await UserInfo.updateClaimAllState(user, true);
}

const createSignature = params => {
    const web3 = new Web3();
    const message = web3.utils.soliditySha3(
      { t: 'address', v: params.recipient },
      { t: 'uint256', v: web3.utils.toWei(params.amount.toString()) }
    ).toString('hex');
    const privateKey = process.env.OWNER_PRIVATE_KEY;
    const { signature } = web3.eth.accounts.sign(
      message,
      privateKey
    );

    return signature;
}

module.exports = {
    getClaimState: getClaimState,
    doClaimToken: doClaimToken,
    getAllTokens: getAllTokens,
    updateClaimAllState: updateClaimAllState
}