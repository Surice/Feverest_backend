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

    while(rounds > 0){
        rounds --;

        mergeOutput(res, checkRecipe(terms.item));
    }

    let sortedCraftingSteps = sortCraftingSteps();
    if(remain > 0) unusedItems[terms.item] = remain;
    return {
        requiredItems: res,
        unusedItems,
        sortedCraftingSteps
    }
}

function checkRecipe(item){
    step ++;
    craftingSteps.unshift(new Array(item, new Object()));

    let itemData = allItems[item],
        output = new Object(),
        currentStep = craftingSteps[0][1];
    

    itemData.recipe.forEach((recipeItem) => {
        if(currentStep[recipeItem]){
            currentStep[recipeItem] ++;
        }else{
            currentStep[recipeItem] = 1;
        }

        if(!allItems[recipeItem]){
            if(!output[recipeItem]) output[recipeItem] = 0;

            output[recipeItem] ++;
        }else{
            if(unusedItems[recipeItem]){
                if(unusedItems[recipeItem] > 1){
                    unusedItems[recipeItem] --;
                }else{
                    delete unusedItems[recipeItem];
                }
            }else{
                let recipeItemRecipe = allItems[recipeItem];

                if(recipeItemRecipe.quan > 1){
                    unusedItems[recipeItem] = recipeItemRecipe.quan -1;
                }
                let recipeRes = checkRecipe(recipeItem);

                output = mergeOutput(output, recipeRes);
            }
        }    
    });

    return output;
}


function mergeOutput(output, items){
    for(e in items){
        if(output[e]){
            output[e] += items[e];
        }else{
            output[e] = items[e];
        }
    }

    return output;
}
function sortCraftingSteps(){
    let res = new Object();
    craftingSteps.forEach(step => {
        if(res[step[0]]){
            res[step[0]].quan ++;
        }else{
            res[step[0]] = {
                quan: 1,
                recipe: step[1]
            };
        }
    });

    for(step in res){
        for(item in res[step].recipe){
            res[step].recipe[item] = res[step].recipe[item] * res[step].quan;
        }

        res[step].quan = res[step].quan * allItems[step].quan;
    }

    return res;
}


module.exports = { getItemList, composeRecipe }