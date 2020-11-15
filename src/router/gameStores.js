const express = require('express');
const router = express.Router();

const steamFreeSearch = require('../common/steamFreeSearch');


router.get('/getFreeGames', async function(req, res){

    steamFreeSearch.getGamesList();


    res.status(200).json({  });
});


module.exports = router;