const express = require('express');
const router = express.Router();

const newsletterService = require('../newsletter/newsletter');

router.post('/addCustomer', (req, res) => {
    console.log(req.body);
    if(!newsletterService.addMailToNewsletter(req.body.mail)) res.status(500);
    res.status(200).send("success");
});

router.post('/removeCustomer', (req, res) => {
    if(!newsletterService.removeMailToNewsletter(req.body.mail)) res.status(500);
    res.status(200).send("success");
});

module.exports = router;