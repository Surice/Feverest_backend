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
    let sql = 'SELECT COUNT(id) FROM `visits`',
        sqlLast = 'SELECT COUNT(id) FROM `visits` WHERE timestamp >= (CURDATE() + INTERVAL -7 DAY)',
        sql2 = 'SELECT COUNT(id) FROM `visits` WHERE clientType = ?',
        sql3 = 'SELECT COUNT(id) FROM `visits` WHERE clientType = ?',
        value2 = "Mobile",
        value3 = "Windows";

    try{
        let count = await dbQuery(sql),
            countTemp = await dbQuery(sqlLast);
        
        return {count: count[0]['COUNT(id)'], temp: count[0]['COUNT(id)']};
    }catch(err){
        console.log(err);
        return false;
    }
}

async function getRegisteredUsers(){
    let sql = 'SELECT COUNT(id) FROM `user_accounts`',
        sql2 = 'SELECT COUNT(id) FROM `user_accounts` WHERE role = ?',
        sql3 = 'SELECT COUNT(id) FROM `user_accounts` WHERE role = ?',
        value2 = "dev",
        value3 = "user";

    try{
        let count = await dbQuery(sql);

        return count[0]['COUNT(id)'];
    }catch(err){
        console.log(err);
        return false;
    }
}

module.exports = { newVisit, getVisits, getRegisteredUsers };