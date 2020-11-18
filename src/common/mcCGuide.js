const fs = require('fs');

function getItemList(){
    let allItems = JSON.parse(fs.readFileSync(`${__dirname}/../stor/mcItems.json`, "utf8").toString());
    let response = new Array();

    for(e in allItems) {
        response.push(e);
    }

    return response;
}

function composeRecipe(){
    
}

module.exports = { getItemList };