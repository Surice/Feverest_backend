const express = require('express');
const app = express();

const cors = require('cors');
//const bodyParser = require('body-parser');

const port = 8085;

app.use(express.json());
//app.use(bodyParser.json());

//app.use(cors());

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requestet-With, Content-Type, Accept, Authorization");
//     next();
// });

const userRouter = require('./router/user');
const gameStoresRouter = require('./router/gameStores');
const mcCGuideRouter = require('./router/mcCGuide');
const accAssistantRouter = require('./router/accAssistant');
const satisCalculatorRouter = require('./router/satisCalculator');



app
    .use('/api/user', userRouter)
    .use('/api/gameStores', gameStoresRouter)
    .use('/api/mcCGuide', mcCGuideRouter)
    .use('/api/accAss', accAssistantRouter)
    .use('/api/statisCalc', satisCalculatorRouter)
;

app.get('/api/test', function(req, res) {
    res.send("Success");
});


app.listen(port, function(){
    console.log(`listen on port ${port}`);
});