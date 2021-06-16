const express = require('express');
const router = express.Router();

const newsletterService = require('../newsletter/newsletter');

router.post('/addCustomer', (req, res) => {
    if(newsletterService.addMailToNewsletter(req.query.mail) != true) {
        res.status(409).send("allready signed up");
        return;
    }
    res.status(200).send("success");
});

router.post('/removeCustomer', (req, res) => {
    if(newsletterService.removeMailToNewsletter(req.query.mail) != true) {
        res.status(409).send("not signed up");
        return;
    }
    res.status(200).send("success");
});

module.exports = router;