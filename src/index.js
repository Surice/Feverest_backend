const express = require('express');
const app = express();
//const bodyParser = require('body-parser');

const port = 8085;

app.use(express.json());
//app.use(bodyParser.json());

const userRouter = require('./router/user');
const gameStoresRouter = require('./router/gameStores');
const mcCGuideRouter = require('./router/mcCGuide');



app
    .use('/api/user', userRouter)
    .use('/api/gameStores', gameStoresRouter)
    .use('/api/mcCGuide', mcCGuideRouter)
;

app.get('/api/test', function(req, res) {
    res.send("Success");
});


app.listen(port, function(){
    console.log(`listen on port ${port}`);
});