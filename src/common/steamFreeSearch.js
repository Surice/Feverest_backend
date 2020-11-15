const fs = require('fs');

function getGamesList(){
    let gameData = JSON.parse(fs.readFileSync(`${__dirname}/../stor/freeGames.json`, "utf8").toString());
    let output = new Object();

    for (e in gameData){
        output[e] = new Array();
        gameData = gameData[e];

        gameData.forEach(element => {
            output[e].push({name: element[0], url: element[1]});
        });
    }

    return output;
}


module.exports = { getGamesList };