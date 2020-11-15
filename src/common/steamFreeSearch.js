const fs = require('fs');
const xml = require("xmlhttprequest").XMLHttpRequest;


const config = JSON.parse(fs.readFileSync(`${__dirname}/../config.json`, "utf-8").toString());

const steamAPI = `http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=${config.SteamApiKey}&format=json`;

var gamesIdList = new Array(),
    finalOutput = new Object(),
    idConter = 0,
    failedRequests = new Object();

function getGamesList(){
    let date = getTimeStamp();
    finalOutput[date] = new Array();


    var initReq = new xml();

    initReq.open('GET', steamAPI, true);
    initReq.send();
    initReq.onreadystatechange = async function(){
        if(this.readyState == 4 && this.status == 200){
            const rawGameList = JSON.parse(this.responseText);

            if(!rawGameList.applist.apps[0]) getGamesList();
            
            await rawGameList.applist.apps.forEach(e => {
                gamesIdList.push(e.appid);
                idConter ++;
            });
            console.log(`check: ${idConter}\n`);

            var requiredRounds = gamesIdList.length/1000;

            processIdList(requiredRounds);
        }else{
            if(this.readyState == 4){
                console.log("unexpected init Error: \n"+ this.status);
            }
        }
    }
}

function processIdList(requiredRounds){
    if(requiredRounds > 0){
        console.log(`turn ${requiredRounds}`);

        requiredRounds --;
        var partOfIdList = gamesIdList.splice(0, 1000);
                            
        partOfIdList = partOfIdList.join(",");

        var req = new xml();
        req.open('GET', `https://store.steampowered.com/api/appdetails?appids=${partOfIdList}&filters=price_overview`);
        req.send();
        req.onreadystatechange = async function(){
            if(req.readyState == 4 && req.status == 200){
                const content = JSON.parse(req.responseText);

                for(var [id, item] of Object.entries(content)){
                    if(item.data && item.data.price_overview){
                        if(item.data.price_overview.disidConter_percent == 100){
                            checkName(id, function(result){
                                finalOutput[date].push(result);
                                console.log(finalOutput);
                            });
                        }
                    }
                }
                processIdList(requiredRounds);
            }else if(req.readyState == 4){
                console.log(`Request Faild \nerr(${req.status}). try to handle`);

                const time = 3500;
                console.log(`retry in ${time}ms`);
                
                requiredRounds++;
                if(failedRequests[requiredRounds]){ failedRequests[requiredRounds] ++; }
                else{ failedRequests[requiredRounds] = 1; }

                if(failedRequests[requiredRounds] > 5){
                    console.log("!request skipped!");

                    processIdList(requiredRounds);
                }else{
                    partOfIdList = partOfIdList.split(",");
                    gamesIdList = gamesIdList.concat(partOfIdList);

                    setTimeout(processIdList, time, requiredRounds);
                }
            }
        }
    }else{
        console.log(finalOutput);
    }
}
function checkName(id, callback){
    console.log(`fetch name for ${id}`);

    var checkreq = new xml();
    checkreq.open('GET',  `https://store.steampowered.com/api/appdetails?appgamesIdList=${id}`, true);
    checkreq.send();
    checkreq.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const response = JSON.parse(this.responseText);

            if(response[id].data && response[id].data.name){
                const link = `https://store.steampowered.com/app/${id}`
                console.log(`fond> ${response[id].data.name}`);

                var push = new Array(response[id].data.name, link.toString());
                callback(push);
            }else{
                console.log("data error");
                setTimeout(checkName, 120000, id, callback);
            }
        }
        else if(this.readyState == 4){
            console.log(`Fetch Faild \nerr(${this.status})`);
            setTimeout(checkName, 120000, id, callback);
        }
    }
}


function getTimeStamp(){
    var dateRaw = new Date();
    if(dateRaw.getMinutes() < 10){
        var min = "0"+dateRaw.getMinutes();
    }else{var min = dateRaw.getMinutes()};
    if(dateRaw.getHours() < 10){
        var hou = "0"+dateRaw.getHours();
    }else{var hou = dateRaw.getHours()};

    return `${hou}:${min} (${dateRaw.getDate()}/${dateRaw.getMonth()+1}/${dateRaw.getFullYear()})`;
}


module.exports = { getGamesList };