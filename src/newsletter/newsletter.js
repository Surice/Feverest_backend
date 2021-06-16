const fs = require('fs');
const cron = require('cron');
const nodemailer = require('nodemailer');

const config = JSON.parse(fs.readFileSync(`${__dirname}/../config.json`, "utf-8"));

const head = fs.readFileSync(`${__dirname}/format/head.html`),
    foot = fs.readFileSync(`${__dirname}/format/foot.html`);

let mail = nodemailer.createTransport({
    host: 'smtp.strato.de',
    port: 465,
    secure: true,
    auth: {
        user: config.mailUser,
        pass: config.mailPass
    }
});

function addMailToNewsletter(adresse) {
    let adresses = JSON.parse(fs.readFileSync(`${__dirname}/adresses.json`, "utf-8").toString());

    if(adresses.indexOf(adresse) != parseInt(-1)) return;
    adresses.push(adresse);

    fs.writeFileSync(`${__dirname}/adresses.json`, JSON.stringify(adresses));
    return true;
}

function removeMailToNewsletter(adresse) {
    let adresses = JSON.parse(fs.readFileSync(`${__dirname}/adresses.json`, "utf-8").toString());

    if(!adresses.indexOf(adresse)) return;
    adresses.slice(adresses.indexOf(adresse), 1);

    fs.writeFileSync(`${__dirname}/adresses.json`, JSON.stringify(adresse));
    return true;
}



function newsletter() {
    const job = new cron.CronJob(`0 20 * * *`, () => {
        sendMail();
    });

    job.start();
}

function buildTable(games) {
    let out = "";
    for (item in games.stores) {
        games.stores[item].forEach(e => {
            out += `<tr><td>${e[0]}</td><td>${item}</td><td>${e[1]}</td></tr>`;
        });
    }

    return `<table border="1" style="border-collaps: collaps;"><b><tr style=""><th>Game</th><th>Plattform</th><th>Link</th></tr></b>${out}</table>`
}


function sendMail() {
    let customers = JSON.parse(fs.readFileSync(`${__dirname}/adresses.json`, "utf-8").toString()),
        games = JSON.parse(fs.readFileSync(`${__dirname}/../stor/freeGames.json`, "utf-8").toString());

    mail.sendMail({
        from: '(noreply)Free-Games@feverest.de',
        to: 'nobody',
        bcc: customers,
        subject: "FreeGames",
        html:
            `
            ${head}
            Update from: ${new Date().getDate()}.${new Date().getMonth()+1}.${new Date().getFullYear()}
            <br>
            ${buildTable(games)}
            ${foot}
        `,
        attachments: [{
            filename: 'navbar.png',
            path: `${__dirname}/format/navbar.png`,
            cid: "navbar@feverest.de"
        }]
    });
}


module.exports = { addMailToNewsletter, removeMailToNewsletter, newsletter };
