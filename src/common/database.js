const fs = require('fs');
const mysql = require('mysql');

const config = JSON.parse(fs.readFileSync(`${__dirname}/../config.json`));

const db = mysql.createPool({
    host: '192.168.178.31',
    user: config.dbUser,
    password: config.dbPassword,
    database: 'feverest'
});

module.exports = db;