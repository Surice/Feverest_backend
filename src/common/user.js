const fs = require('fs');
const crypto = require('crypto');
const db = require('./database');
const jwt = require('jsonwebtoken');
const util = require('util');

const config = JSON.parse(fs.readFileSync(`${__dirname}/../config.json`).toString());


async function register(username, pass, firstName, lastName, email) {
    pass = await cryptPass(pass);

    let sql = 'SELECT id FROM user_accounts WHERE email = ?',
        value = email;

    const dbQuery = util.promisify(db.query).bind(db);

    let data = await dbQuery(sql, value);
    if(data[0]) return false;

    sql = 'INSERT INTO `user_accounts`(username, password, firstName, lastName, email, salt) VALUES (?)';
    let values = new Array(username, pass.hash, firstName, lastName, email, pass.salt);

    try{
        await dbQuery(sql, [values]);
    }catch(err){
        console.log(err);
        return false;
    }

    return true;
}


async function login(email, pass) {
    let sql = 'SELECT id, password, salt FROM user_accounts WHERE email = ?',
    value = email;

    const dbQuery = util.promisify(db.query).bind(db);

    let data = await dbQuery(sql, value);
    if(!data[0]) return false;

    pass = await cryptPass(pass, data[0].salt);
    if(data[0].password === pass.hash){
        const token = jwt.sign({ id: data[0].id }, config.jwtSecret, { expiresIn: "30d" });

        return { token, role: data[0].role };
    }else{
        return false;
    }
}


async function remove(email, pass) {
    let sql = 'SELECT id, password, salt FROM user_accounts WHERE email = ?',
    value = email;

    const dbQuery = util.promisify(db.query).bind(db);

    let data = await dbQuery(sql, value);
    if(!data[0]) return false;

    pass = await cryptPass(pass, data[0].salt);

    if(data[0].password === pass.hash){
        let sql = 'DELETE FROM user_accounts WHERE id = ?',
        value = data[0].id;
        try{
            await dbQuery(sql, value);
        }catch(err){
            return false;
        }

        return true;
    }else{
        return false;
    }
}


async function checkToken(token) {
    try{
        jwt.verify(token, config.jwtSecret);
    }catch(e){
        return false;
    }
    let tokenData = jwt.decode(token);

    let sql = 'SELECT role FROM user_accounts WHERE id = ?',
    value = tokenData.id;

    const dbQuery = util.promisify(db.query).bind(db);

    let role = await dbQuery(sql, value);


    return role;
}




function cryptPass(password, salt) {
    return new Promise( (resolve, reject) => {
        let buffer = crypto.randomBytes(32);
        if(!salt) salt = buffer.toString("hex");
        
        crypto.scrypt(password, salt, 128, (err, hash) => {
            if(err) throw reject(err);
            
            hash = hash.toString("hex");

            resolve({ hash, salt });
        });
    });
}

module.exports = { register, login, remove, checkToken };
