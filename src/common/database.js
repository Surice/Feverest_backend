const fs = require('fs');
const mysql = require('mysql');

const config = JSON.parse(fs.readFileSync(`${__dirname}/../config.json`));

const db = mysql.createPool({
    host: 'localhost',
    user: config.dbUser,
    password: config.dbPassword,
    database: 'feverest-test'
});

module.exports = db;