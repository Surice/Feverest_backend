const express = require('express');
const router = express.Router();

const analytics = require('../common/analytics');

router.get('/newVisit', function(req, res){
    analytics.newVisit(req.headers['user-agent']);
    
    res.status(200);
});

router.get('/getVisits', async function(req, res){
    let count = await analytics.getVisits();

    res.status(200).json({count});
});

router.get('/getRegisteredUsers', async function(req, res){
    let count = await analytics.getRegisteredUsers();

    res.status(200).json({count});
});


module.exports = router;