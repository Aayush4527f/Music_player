'use strict';
require('dotenv').config();
const testFolder =  './songs'
const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path')
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { render } = require('ejs');
//using body and cookie parsers
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

//reading all songs
let songs = []
fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      songs.push(file);
    });
});


//serving static files and setting ejs as renderer
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, testFolder)));
app.set('view engine' , 'ejs')
    
// endpoints
app.get('/songslist',(req,res)=>{
    res.json(songs)
})

app.get('/',(req,res)=>{
    res.render('index.ejs')
})
app.get('/saved',(req,res)=>{
    // console.log(req.cookies.playlist)
    res.json(req.cookies.playlist)
})

// starting the server
app.listen(process.env.PORT || 8000, ()=> {
    console.log(`server started on port ${process.env.PORT || 8000}`);
});