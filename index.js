let express = require("express")
// let multer  = require('multer')
const mongoose = require('mongoose');
// import mongoose from 'mongoose';

const User = require('./models/users.js')

const bcrypt = require('bcrypt');
const saltRounds = 10;

let cookieParser = require('cookie-parser')
let session = require('express-session')

let bodyParser = require('body-parser')


const app = express()
// let upload = multer()
//使用cookieParser解析cookie
app.use(cookieParser())
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
//使用session
// app.use(session({
//     secret:"",
//     resave:false,
//     saveUninitialized:false,
// }))
//使用mongoose連線本機mongoDB資料庫
mongoose.connect('mongodb://localhost:27017/exampleDB')
    .then(()=>{
        console.log('connected to mongoDB.')
    })
    .catch((err)=>{
        console.log('connection failed.')
        console.log(err)
    });

//資料定義期限制
// const exampleSchema = new mongoose.Schema({
//     name:String,
//     age:Number
// })    

//為資料定義限制
// const Example = mongoose.model("Example", exampleSchema)

//定義資料
// const John = new Example({
//     name:'John',
//     age : 26
// })

// 加入新資料
// John.save()
//     .then(()=>{
//         console.log('has been saved')
//     })
//     .catch((e)=>{
//         console.log('error save')
//         console.log(e)
//     })

//查找資料
// Example.find({}).then((data)=>{
//     console.log(data)
// })

app.use(express.urlencoded({ extended: true }))//收Form data 用 (POST)
app.use((request,response,next)=>{
	console.log('有人请求服务器了');
	console.log(request.url);
	next()
})

debugger
app.post('/signUp',async function(request, response){
    response.setHeader('Access-Control-Allow-Origin','*')
    let {username, password} = request.body
    // console.log('SIGNUP.body',request.body)
    // console.log('SIGNUP.query',request.query)
    // console.log('SIGNUP.params',request.params)
    

    try{
        let foundUser = await User.findOne({username})
        if(foundUser){
            // response.send('username has been taken.')
        } else {
            bcrypt.genSalt(saltRounds, (err, salt)=>{
                bcrypt.hash(password, salt, (err, hash)=>{
                    let newUser = new User({username, password:hash})
                    try {
                        newUser.save()
                            .then(()=>{
                                // response.redirect('http://localhost:8080/#/member')
                                response.status(200).json({ msg:'註冊成功' })
                                
                            }).catch((e)=>{
                                response.status(500).json({ msg: 'error', error:e })
                            })
                    } catch (err){
                        console.log(err)
                    }   
                })
            })
        }
    }catch(e){

    }
    
    console.log('收到的整個Data:',request.body,'username:',request.body.username) //POST時拿Form data
})

app.post('/signIn',async function(request, response){
    response.setHeader('Access-Control-Allow-Origin','*')
    let {username, password} = request.body
    try {
        let foundUser = await User.findOne({
            username
        })
        if (foundUser) {
            bcrypt.compare(password, foundUser.password, (err, result)=>{
                if (err) {
                    
                }
                if (result ===true) {
                    response.json({username})
                } else {
                    response.send('Username or password is incorrect.')
                }
            })
        } else {
            response.send('Username or password is incorrect.')
        }
    } catch (e){

    }

    console.log('收到的整個Data:',request.body,'username:',request.body.username) //POST時拿Form data
})

// app.get('/testGet',function(request, response){
//     response.setHeader('Access-Control-Allow-Origin','*')
//     // response.send("Hello EXPRESS by GET")
//     console.log(request.query)//GET時拿Form data
// })

// app.post('/testPost',function(request, response){
//     response.setHeader('Access-Control-Allow-Origin','*')
//     // response.send("Hello EXPRESS by POST")
//     console.log('收到的整個Data:',request.body,'username:',request.body.username) //POST時拿Form data
// })

// app.all('/server', function(request, response){
//     response.setHeader('Access-Control-Allow-Origin','*')
//     response.setHeader('Access-Control-Allow-Headers','*')
//     const data = {
//         name:"sneakers0"
//     }
//     let str = JSON.stringify(data)
//     response.send(str)
// })

app.listen(5000,()=>{
    console.log("已啟動，5000端口監聽中")
})