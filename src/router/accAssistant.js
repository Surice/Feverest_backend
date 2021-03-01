const express = require('express');
const router = express.Router();

const accAssistant = require('../common/accAssistant');

router.post('/calculate', async function(req, res){
    let result = await accAssistant.calculate(req.body.distance, req.body.dropdown, req.body.checkbox2laps, req.body.checkboxSaveFuel, req.body.laptime, req.body.fuelcon, req.body.fueltank);
    
    res.status(200).json(result);
});

module.exports = router;