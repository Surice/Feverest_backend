const db = require('./database');
const util = require('util');

const dbQuery = util.promisify(db.query).bind(db);

async function newVisit(userAgent){
    let client = "";
    if(userAgent.match('Windows')){
        client = "Windows";
    }
    else if(userAgent.match('iPhone') || userAgent.match('Android')){
        client = "Mobile";
    }else{
        client = "undefined";
    }

    let sql = 'INSERT INTO `visits`(clientType) VALUES (?)',
        value = client;

    try{
        await dbQuery(sql, [value]);
    }catch(err){
        console.log(err);
    }
}

async function getVisits(){
    let sql = 'SELECT COUNT(clientType) FROM `visits`',
        sql2 = 'SELECT COUNT() FROM `visits` WHERE clientType = ?',
        sql3 = 'SELECT COUNT() FROM `visits` WHERE clientType = ?',
        value2 = "Mobile",
        value3 = "Windows";

    try{
        return count = await dbQuery(sql);
    }catch(err){
        console.log(err);
        return false;
    }
}

module.exports = { newVisit, getVisits };