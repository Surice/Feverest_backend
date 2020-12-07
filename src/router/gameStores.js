const express = require('express');
const router = express.Router();

const freeGamesSearch = require('../common/freeGamesSearch');


router.get('/getFreeGames', async function(req, res){
    let gameList = freeGamesSearch.getGamesList();

    res.status(200).json( gameList );
});


module.exports = router;