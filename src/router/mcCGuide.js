const express = require('express');
const router = express.Router();

const mcCGuide = require('../common/mcCGuide');


router.get('/getAllItems', async function(req, res) {
    let items = mcCGuide.getItemList();

    res.status(200).json( items );
});

router.post('/composeRecipe', async function(req, res) {
    const terms = {
        item: req.body.itemName,
        quan: req.body.quan
    };
    console.log(req.body);

    let data = await mcCGuide.composeRecipe(terms);

    res.status(200).json( data );
});


module.exports = router;