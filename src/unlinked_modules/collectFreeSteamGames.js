const fs = require('fs');
const { default: Axios } = require('axios');


const config = JSON.parse(fs.readFileSync(`${__dirname}/../config.json`, "utf-8").toString());

const steamAPI = `http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=${config.SteamApiKey}&format=json`;


let freeGames = JSON.parse(fs.readFileSync(`${__dirname}/../stor/freeGames.json`, "utf8").toString());

let allItemIds = new Array();

let dateRaw = new Date();
if(dateRaw.getMinutes() < 10){
//    dateRaw.getMinutes() = "0"+dateRaw.getMinutes();
}
if(dateRaw.getHours() < 10){
//    dateRaw.getHours() = "0"+dateRaw.getHours();
}

date = `${dateRaw.getHours()}:${dateRaw.getMinutes()} (${dateRaw.getDate()}/${dateRaw.getMonth()+1}/${dateRaw.getFullYear()})`;

freeGames.state = date;
freeGames.stores.steam = [];

Axios.get(steamAPI).then(async response => {
    const gameList = response.data;

    if(!gameList.applist.apps[0]) initRequest();

    gameList.applist.apps.forEach(element => {
        allItemIds.push(element.appid);
    });
    console.log("check: "+ allItemIds.length+ "\n");

    let allItemIdsSort = new Array();
    while(allItemIds.length > 1000){
        allItemIdsSort.push(allItemIds.splice(0,1000));
    }
    allItemIdsSort.push(allItemIds)
    allItemIds = allItemIdsSort;

    await allItemIds.forEach(section => {
        checkSection(section, (result) => {
            if(result.length > 0){
                freeGames.stores.steam = freeGames.stores.steam.concat(result);
		console.log("section completed");
                fs.writeFileSync(`${__dirname}/../stor/freeGames.json`, JSON.stringify(freeGames));
            }else{
		fs.writeFileSync(`${__dirname}/../stor/freeGames.json`, JSON.stringify(freeGames));
		}
        });
    });

	console.log("ready");
});


async function checkSection(section, callback){
    let result = new Array();
	console.log("checking new Section");

    Axios.get(`https://store.steampowered.com/api/appdetails?appids=${section}&filters=price_overview`).then(async response => {
        const content = response.data;

        for(var [id, item] of Object.entries(content)){
            if(item.success && item.data.price_overview){
                //if(item.data.price_overview.discount_percent > 0) console.log(item.data.price_overview.discount_percent);
                if(item.data.price_overview.discount_percent == 100){
                    result.push(await checkData(id));
                }
            }
        }
        
        callback(result);
    }).catch(e => {
	console.log("error");
        setTimeout(checkSection, 35000, section, callback);
    });
}


function checkData(id){
    console.log(`fetching Data for ${id}`);

    return Axios.get(`https://store.steampowered.com/api/appdetails?appids=${id}`).then(response => {
        response = response.data;

        if(response[id].success && response[id].data.name){
            console.log("found> "+ response[id].data.name);

            const link = `https://store.steampowered.com/app/${id}`

            return new Array(response[id].data.name, link.toString());
        }else{
            console.log("cannot fetch data");
            console.log(response[id]);
            setTimeout(checkData, 25000, id);
        }
    }).catch(e => {
        setTimeout(checkData, 35000, id);
    });
}
