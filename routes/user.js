const express = require('express');
const router = express.Router();
const commonUtils = require('../utils/commonUtils');
const claimController = require('../controllers/claim.controller');
const userController = require('../controllers/user.controller');

router.get("/claimstate", async (req, res) => {
    const user = req.query.user;
    let param = {
        user: user,
        date: commonUtils.getDateNow()
    }
    param.claimState = await claimController.getClaimState(user),
    res.json(param);
});

router.get("/info", async (req, res) => {
    const user = req.query.user;
    const userInfo = await userController.getUserInfo(user);
    res.json(userInfo);
});

module.exports = router;