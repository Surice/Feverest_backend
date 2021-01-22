const fs = require('fs');

function getGamesList() {
    let freeGames = JSON.parse(fs.readFileSync(`${__dirname}/../stor/freeGames.json`, "utf8").toString());
    let output = {
        state: freeGames.state,
        data: []
    };

    for(e in freeGames.stores) {
        freeGames.stores[e].forEach(item => {
            output.data.push({
                name: item[0],
                plattform: e,
                url: item[1]
            });
        });
    };

    return output;
}

module.exports = { getGamesList };