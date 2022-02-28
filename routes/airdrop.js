const express = require('express');
const router = express.Router();
const moment = require('moment');
const claimController = require('../controllers/claim.controller');
const commonData = require('../storage/commonData');

router.post("/claim", async (req, res) => {
    // Only during event time
    if (!moment.utc().isBetween(moment(commonData.airDropStartTime), moment(commonData.airDropEndTime))) {
        res.status(400).json({ status: 400, message: "Now is not the time for the event" });
    }
    if (!req.body.params || !req.body.params.user) {
        res.status(400).json({ status: 400, message: "Cannot detect params" });
        return;
    }
    const user = req.body.params.user;
    let params = {
        user: user,
        timeStamp: moment()
    }
    params.result = await claimController.doClaimToken(user);
    res.json(params);
});

router.get("/claim/time", (req, res) => {
    res.json({
        airDropStartTime: moment(commonData.airDropStartTime).valueOf(),
        airDropEndTime: moment(commonData.airDropEndTime).valueOf()
    });
});

router.get("/claim/all", async (req, res, next) => {
    // Get all tokens after airdrop time
    // @false: for test only
    if (!moment.utc().isAfter(moment(commonData.airDropEndTime)) && false) {
        res.status(400).json({ status: 400, message: "Can't get all tokens until the event is over" });
        return;
    }
    if (!req.query.user) {
        res.status(400).json({ status: 400, message: "Cannot detect params" });
        return;
    }
    const user = req.query.user;
    let params = {
        user: user,
        timeStamp: moment()
    }
    params.result = await claimController.getAllTokens(user);
    res.json(params);
});

router.put("/claim/all", async (req, res) => {
    // Get all tokens after airdrop time
    if (moment.utc().isBefore(moment(commonData.airDropEndTime))) {
        res.status(400).json({ status: 400, message: "Can't get all tokens until the event is over" });
        return;
    }
    const rs = await claimController.updateClaimAllState(user);
    if (rs) {
        res.json({ status: 200, message: "updated claim all state" });
        return;
    }
    res.status(500).json({ status: 500, message: "Something went wrong!" });
});

module.exports = router;