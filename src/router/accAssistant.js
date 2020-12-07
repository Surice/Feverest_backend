const express = require('express');
const router = express.Router();

const accAssistant = require('../common/accAssistant');

router.post('/calculate', function(req, res){
    let result = accAssistant.calculate(req.body.distance, req.body.dropdown, req.body.laptime, req.body.fuelcon, req.body.fueltank);

    res.status(200).json(result);
});

module.exports = router;