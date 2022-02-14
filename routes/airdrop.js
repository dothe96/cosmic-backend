const express = require('express');
const router = express.Router();
const moment = require('moment');
const claimController = require('../controllers/claim.controller');
const commonData = require('../storage/commonData');

router.post("/claim", async (req, res) => {
    const user = req.body.params.user;
    let param = {
        user: user,
        timeStamp: moment()
    }
    param.result = await claimController.doClaimToken(user);
    res.json(param);
});

router.get("/claim/time", (req, res) => {
    res.json({ airDropEndTime: moment(commonData.airDropEndTime).valueOf() })
})

module.exports = router;