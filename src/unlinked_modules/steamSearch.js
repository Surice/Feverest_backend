const fs = require('fs');
const xml = require("xmlhttprequest").XMLHttpRequest;


const config = JSON.parse(fs.readFileSync(`${__dirname}/../config.json`, "utf-8").toString());

const steamAPI = `http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=${config.key}&format=json`;
var ids = new Array(),
    count = 0,
    stor = new Object();


    var dateRaw = new Date();
        if(dateRaw.getMinutes() < 10){
            var min = "0"+dateRaw.getMinutes();
        }else{var min = dateRaw.getMinutes()};
        if(dateRaw.getHours() < 10){
            var hou = "0"+dateRaw.getHours();
        }else{var hou = dateRaw.getHours()};
        
        date = `${hou}:${min} (${dateRaw.getDate()}/${dateRaw.getMonth()+1}/${dateRaw.getFullYear()})`;
    
    
    
    stor[date] = new Array();


initRequest();
function initRequest(){
    var initReq = new xml();

    initReq.open('GET', steamAPI, true);
    initReq.send();
    initReq.onreadystatechange = async function(){
        if(this.readyState == 4 && this.status == 200){
            const gameList = JSON.parse(this.responseText);
            if(!gameList.applist.apps[0]){
                initRequest()
            }
            await gameList.applist.apps.forEach(element => {
                ids.push(element.appid);
                count ++;
            });

            console.log("check: "+ count+ "\n");

            var numb = ids.length/1000,
            tempnumb = 0,
            list = new Array();

            reques(numb, tempnumb, list, count);
        }else{
            if(this.readyState == 4){
                console.log("unexpected init Error: \n"+ this.status);
            }
        }
    }
}

function reques(numb, tempnumb, list){
                if(numb > 0){
                    list = ids.splice(0, 1000);
                    numb --;
                                        
                    list = list.join(",");

//                    console.log("lap: "+ (numb+1));

                    var req = new xml();
                    req.open('GET', `https://store.steampowered.com/api/appdetails?appids=${list}&filters=price_overview`);
                    req.send();
                    req.onreadystatechange = async function(){
                        if(req.readyState == 4 && req.status == 200){
                            const content = JSON.parse(req.responseText);

                            for(var [id, item] of Object.entries(content)){
                                if(item.data && item.data.price_overview){
                                    if(item.data.price_overview.discount_percent == 100){

                                        checkName(id, function(result){
                                            
                                            stor[date].push(result);
                                            fs.writeFileSync(`${__dirname}/../stor/freeGames.json`, JSON.stringify(stor));
                                        });
                                    }
                                }
                            }
                            reques(numb, tempnumb, list);
                        }else{
                            if(req.readyState == 4){
                                console.log(`Request Faild \nerr(${req.status}). try to handle`);

                                //may fixed
                                if(req.status == 500 || req.status == 0){
                                    console.log("retry in 35 seconds");
                                    setTimeout(reques, 0,numb, tempnumb, list);
                                }else{
                                    console.log("try again");

                                    list = list.split(",");
                                    await list.forEach(e => {
                                        ids.unshift(e);
                                    });
                                    numb++;

                                    setTimeout(reques, 35000, numb, tempnumb, list);
                                }

                            }
                        }
                    }
                }
}
function checkName(id, callback){
    console.log(`fetch name for ${id}`);
    var checkreq = new xml();
    checkreq.open('GET',  `https://store.steampowered.com/api/appdetails?appids=${id}`, true);
    checkreq.send();
    checkreq.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            const response = JSON.parse(this.responseText);

            if(response[id].data && response[id].data.name){
                const link = `https://store.steampowered.com/app/${id}`
                console.log("find> "+ response[id].data.name);

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