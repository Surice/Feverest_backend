const fs = require('fs');

const allItems = JSON.parse(fs.readFileSync(`${__dirname}/../stor/mcItems.json`, "utf8").toString());

let unusedItems = new Object(),
    craftingSteps = new Array(),
    step = 0;

function getItemList(){
    let response = new Array();

    for(e in allItems) {
        response.push(e);
    }

    return response;
}

function composeRecipe(terms){
    //init compose
    unusedItems = {};
    craftingSteps = [];

    let res = new Object,
        rounds = Math.ceil(terms.quan / allItems[terms.item].quan),
        remain = (allItems[terms.item].quan * rounds) - terms.quan;

    return {
        items: collectItems(allItems[terms.item])
    };
}


function collectItems(itemName) {
    const item = allItems[itemName];
    let response = new Object();

    item.recipe.forEach(element => {
        if(allItems[element]) {
            response.concat(collectItems(element));
        } else {
            if(!response[element]) response[element] = 0;

            response[element] ++;
        }
    });

    return response;
}

module.exports = { getItemList, composeRecipe }