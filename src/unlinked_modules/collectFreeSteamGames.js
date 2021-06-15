const fs = require('fs');
const { default: Axios } = require('axios');


const config = JSON.parse(fs.readFileSync(`${__dirname}/../config.json`, "utf-8").toString());

const steamAPI = `http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=${config.SteamApiKey}&format=json`;


let freeGames = JSON.parse(fs.readFileSync(`${__dirname}/../stor/freeGames.json`, "utf8").toString());

const dateRaw = new Date();
date = `${(dateRaw.getHours().length <= 1) ? "0" + dateRaw.getHours() : dateRaw.getHours()}:${(dateRaw.getMinutes().length <= 1) ? "0" + dateRaw.getMinutes() : dateRaw.getMinutes()} (${dateRaw.getDate()}/${dateRaw.getMonth() + 1}/${dateRaw.getFullYear()})`;

freeGames.state = date;
freeGames.stores.steam = [];

Axios.get(steamAPI).then(async response => {
    const gameList = response.data;
    if (!gameList.applist.apps[0]) initRequest();

    let allItemIds = gameList.applist.apps.map(element => { return element.appid });
    console.log("check: " + allItemIds.length + "\n");

    let allItemIdsSort = new Array();
    while (allItemIds.length > 1000) allItemIdsSort.push(allItemIds.splice(0, 1000));

    allItemIdsSort.push(allItemIds)
    allItemIds = allItemIdsSort;


    allItemIds.forEach(section => {
        checkSection(section, (result) => {
            console.log("saving Item");
            if (result.length > 0) {
                freeGames.stores.steam.push(result);
                fs.writeFileSync(`${__dirname}/../stor/freeGames.json`, JSON.stringify(freeGames));
            }
        });
    });
});


async function checkSection(section, callback) {
    console.log("checking new Section");

    Axios.get(`https://store.steampowered.com/api/appdetails?appids=${section}&filters=price_overview`).then(async response => {
        const content = response.data;

        for (var [id, item] of Object.entries(content)) {
            if (item.success && item.data.price_overview) {
                //if(item.data.price_overview.discount_percent > 0) console.log(item.data.price_overview.discount_percent);
                if (item.data.price_overview.discount_percent == 100) {
                    checkData(id, (fetchedData) => {
                        callback(fetchedData);
                    });
                }
            }
        }
    }).catch(e => {
        console.log("error");
        setTimeout(checkSection, 35000, section, callback);
    });
}


function checkData(id, callback) {
    console.log(`fetching Data for ${id}`);

    Axios.get(`https://store.steampowered.com/api/appdetails?appids=${id}`).then(response => {
        response = response.data;

        if (response[id].success && response[id].data.name) {
            console.log("found> " + response[id].data.name);

            const link = `https://store.steampowered.com/app/${id}`

            callback(new Array(response[id].data.name, link.toString()));
        } else {
            console.log("cannot fetch data");
            console.log(response);
            setTimeout(checkData, 25000, id);
        }
    }).catch(e => {
        setTimeout(checkData, 35000, id, callback);
    });
}