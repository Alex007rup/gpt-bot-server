const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.get("/",(req, res)=>{
    res.send("Hello World");
})

app.listen(process.env.PORT, (err)=>{
    console.log(process.env.PORT);
    err && console.log(err);
    !err && console.log("Server Started");
})