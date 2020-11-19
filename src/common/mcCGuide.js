const { response } = require('express');
const fs = require('fs');

const allItems = JSON.parse(fs.readFileSync(`${__dirname}/../stor/mcItems.json`, "utf8").toString());


function getItemList(){
    let response = new Array();

    for(e in allItems) {
        response.push(e);
    }

    return response;
}

async function composeRecipe(terms){
    let response = { 
        requiredItems: {},
        unusedItems: {},
        craftingSteps: []
    };

    const craftItemData = allItems[terms.item];
    if(!craftItemData) return false;

    let rounds = Math.ceil(terms.quan / craftItemData.quan);
    let remain = (allItems[terms.item].quan * rounds) - terms.quan;
    while(rounds > 0){
        rounds --;
        await startRecipeCheck(craftItemData.recipe);
    }

    response.unusedItems[terms.item] = remain;

    response.unusedItems = await cleanResponse(response.unusedItems);
    return response;


    function startRecipeCheck(recipe){
        recipe.forEach(e => {
            checkRecipe(e);
        });
    }

    function checkRecipe(checkingItemRecipe){
        if(response.unusedItems[checkingItemRecipe]){
            response.unusedItems[checkingItemRecipe] --;
        }else{
            if(allItems[checkingItemRecipe]){
                if(response.unusedItems[checkingItemRecipe]){
                    response.unusedItems[checkingItemRecipe] --;
                }else{
                    response.unusedItems[checkingItemRecipe] = allItems[checkingItemRecipe].quan -1;

                    startRecipeCheck(allItems[checkingItemRecipe].recipe);
                }

                
            }else{
                if(!response.requiredItems[checkingItemRecipe]) response.requiredItems[checkingItemRecipe] = 0;
                
                response.requiredItems[checkingItemRecipe] ++;
            }
        }
    }
}

function cleanResponse(items){
    for(e in items) {
        if(items[e] == 0) delete items[e];  
    }

    return items;
}




module.exports = { getItemList, composeRecipe };