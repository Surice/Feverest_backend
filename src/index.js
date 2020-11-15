const express = require('express');
const app = express();

const port = 8085;

app.use(express.json());

const userRouter = require('./router/user');
const gameStoresRouter = require('./router/gameStores');



app
    .use('/api/user', userRouter)
    .use('/api/gameStores', gameStoresRouter)
;



app.listen(port, function(){
    console.log(`listen on port ${port}`);
});