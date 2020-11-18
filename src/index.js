const express = require('express');
const app = express();

const port = 8085;

app.use(express.json());

const userRouter = require('./router/user');
const gameStoresRouter = require('./router/gameStores');
const mcCGuideRouter = require('./router/mcCGuide');



app
    .use('/api/user', userRouter)
    .use('/api/gameStores', gameStoresRouter)
    .use('/api/mcCGuide', mcCGuideRouter)
;



app.listen(port, function(){
    console.log(`listen on port ${port}`);
});