const express = require('express');
const router = express.Router();

const satisCalc = require('../common/satisCalculator.js');


router.get('/getAllRecipes', async function(req, res) {
    let recipes = satisCalc.getRecipeList();

    res.status(200).json( recipes );
});

router.post('/composeRecipe', async function(req, res) {
    const terms = {
        item: req.body.itemName,
        quan: req.body.quan
    };

    let data = await satisCalc.composeRecipe(terms);

    res.status(200).json( data );
});


module.exports = router;