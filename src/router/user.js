const express = require('express');
const router = express.Router();

const userFile = require('../common/user');

router.post('/register', async function(req, res){
    let register = await userFile.register(req.body.username, req.body.password, req.body.firstName, req.body.lastName, req.body.email);

    if(!register){
        res.status(400).json({ error: "unknown error" });
        return;
    }
    res.status(200).json({ register });
});

router.post('/login', async function(req, res){
    let login = await userFile.login(req.body.email, req.body.password);

    if(!login){
        res.status(401).json({ error: "incorrect logindata" });
        return;
    }
    res.status(200).json({ login });
});

router.post('/remove', async function(req, res){
    let remove = await userFile.remove(req.body.email, req.body.password);

    if(!remove){
        res.status(401).json({ error: "incorrect logindata" });
        return;
    }
    res.status(200).json({ state: "success" });
});


module.exports = router;