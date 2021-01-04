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
    res.status(200).json( login );
});

router.post('/remove', async function(req, res){
    let remove = await userFile.remove(req.body.email, req.body.password);

    if(!remove){
        res.status(401).json({ error: "incorrect logindata" });
        return;
    }
    res.status(200).json({ state: "success" });
});

router.get('/checkToken', async function(req, res){
    let token = getToken(req.headers.cookie);
    let check = await userFile.checkToken(token);

    if(!check){
        res.status(401).json({ error: "incorrect Token" });
        return;
    }

    res.status(200).json({ token });
})

function getToken(cookies){
    let out = "";
    if(!cookies) return out;

    try{
        coookies = cookies.split(";");

        cookies.forEach(e=>{
            if(e.startsWith("token=")){
                out = e.slice(6);
            }
        });
    }catch(e){
        if(cookies.startsWith("token=")){
            out = cookies.slice(6);
        }
    }
    
 
    return out;
}

module.exports = router;