const { response } = require('express');
const fs = require('fs');

let allItems = JSON.parse(fs.readFileSync(`${__dirname}/../stor/mcItems.json`, "utf8").toString());


function getItemList(){
    let response = new Array();

    for(e in allItems) {
        response.push(e);
    }

    return response;
}

function composeRecipe(terms){
    let response = { 
        state: "success",
        recipe: allItems[terms.item]
    };

    return response;
}

module.exports = { getItemList, composeRecipe };