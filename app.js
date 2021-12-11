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
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

// let db = undefined;
// fs.readFile('./db.json','utf-8',(err,data)=>{
//     if(err){
//         console.error(err)
//     }else{
//         db = JSON.parse(data)
//     }
// })

let songs = []
fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      songs.push(file);
    });
});



app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, testFolder)));
app.set('view engine' , 'ejs')
    
// app.get('/login',(req,res)=>{
//     async function verifyIt() {
//         try {
//             jwt.verify(req.cookies.token,process.env.access_token_secret)
//             res.redirect('/')
    
//         } catch (error) {
//             console.log(error.message)
//             res.render('login.ejs')
//         }
//     }
//     verifyIt();
// })
// app.post('/login',async (req,res)=>{
//     const {username , password , remember} = req.body;

//     function FindUser() {
//         let temp = false;
//         for(let i = 0; i<db.length; i++){
//             if (db[i].username == username) {
//                 temp = true
//                 return db[i].password
//             }
//         }
//         if(temp == false){
//             return false
//         }
//     }
//     let userP = FindUser();
//     if(!userP || !await bcrypt.compare(password,userP)){
//         return res.send("Invalid Username or Password")
//     }else if(await bcrypt.compare(password,userP)){

//         if (remember) {
//             let token = jwt.sign({"username":`${username}`},process.env.access_token_secret,{expiresIn:"7d"})
//             res.cookie(`token`,`${token}`,{maxAge:(60*60*24*7)*1000,secure:true})
//             return res.redirect('/')
//         }else{
//             let token = jwt.sign({"username":`${username}`},process.env.access_token_secret,{ expiresIn:"30 minutes" })
    
//             res.cookie(`token`,`${token}`,{maxAge: (60*31)*1000,secure:true})
//             return res.redirect('/')
//         }
//     }
// })
app.get('/songslist',(req,res)=>{
    res.json(songs)
})

app.get('/',(req,res)=>{
    res.render('index.ejs')
})
app.get('/saved',(req,res)=>{
    res.json(req.cookies.playlist)
})

app.listen(process.env.PORT, ()=> {
    console.log(`server started on port ${process.env.PORT}`);
  });