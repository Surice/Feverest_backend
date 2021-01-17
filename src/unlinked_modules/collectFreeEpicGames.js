const fs = require('fs');
const xml = require("xmlhttprequest").XMLHttpRequest;

const epicAPI = `https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions`;

let freeGames = JSON.parse(fs.readFileSync(`${__dirname}/../stor/freeGames.json`, "utf8").toString());

freeGames.stores.epic = [];

let checkreq = new xml();
checkreq.open('GET',  epicAPI);
checkreq.send();
checkreq.onreadystatechange = async function(){
    if(this.readyState == 4 && this.status == 200){
        const response = JSON.parse(this.responseText);

        await response.data.Catalog.searchStore.elements.forEach(e => {
            if(e.price.totalPrice.discountPrice == 0){
                freeGames.stores.epic.push([e.title, `https://www.epicgames.com/store/en-US/product/${e.productSlug}/home`]);
            }
        });

        fs.writeFileSync(`${__dirname}/../stor/freeGames.json`, JSON.stringify(freeGames));
    }
}