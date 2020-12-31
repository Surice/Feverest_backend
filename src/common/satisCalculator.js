const fs = require('fs');

const allRecipes = JSON.parse(fs.readFileSync(`${__dirname}/../stor/statisRecipes.json`, "utf8").toString());

function composeRecipe(terms){
    let oputput = new Object();

    let output = fetchProducer(terms.item);
}

function fetchProducer(item){
    let res = new Object(),
        itemData = allRecipes[item];

    for (e in itemData.recipe){

    }
}


module.exports = { composeRecipe };