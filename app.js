const express =require('express')
const app =express();
const db=require('./db')
const port = 2010;
const cors = require('cors')
app.use(cors())



app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const authController = require('./auth/authController');
app.use('/api/auth',authController) // localhost:6000/api/auth (url which we want to define)

app.listen(port,()=>{
    console.log(`localhost:${port}`)
})