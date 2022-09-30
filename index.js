let express = require("express")
// let multer  = require('multer')
const mongoose = require('mongoose');
// import mongoose from 'mongoose';

const User = require('./models/users.js')

const bcrypt = require('bcrypt');
const saltRounds = 10;

let cookieParser = require('cookie-parser')
// let session = require('express-session')

const jwt = require('jsonwebtoken')

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


app.use(express.urlencoded({ extended: true }))//收Form data 用 (POST)
app.use((request,response,next)=>{
	console.log('伺服器被請求了   ','被請求的router:',request.url);
	next()
})


app.post('/signUp',async function(request, response){
    response.setHeader('Access-Control-Allow-Origin','*')
    let {username, password} = request.body
    // console.log('SIGNUP.body',request.body)
    // console.log('SIGNUP.query',request.query)
    // console.log('SIGNUP.params',request.params)
    

    try{
        let foundUser = await User.findOne({username})
        if(foundUser){
            response.status(200).json({ msg:'註冊失敗，使用者名稱已存在', success:false })
            console.log('註冊失敗',foundUser.username,'已有人使用')
        } else {
            bcrypt.genSalt(saltRounds, (err, salt)=>{
                bcrypt.hash(password, salt, (err, hash)=>{
                    let newUser = new User({username, password:hash})
                    try {
                        newUser.save()
                            .then(()=>{
                                response.status(200).json({ msg:'註冊成功', success:true })
                                console.log('新用戶',newUser.username,'註冊成功')
                            }).catch((e)=>{
                                response.status(500).json({ msg: 'error', error:e })
                                console.log('用戶',newUser.username,'註冊失敗')
                            })
                    } catch (err){
                        console.log(err)
                        console.log('註冊失敗')
                    }   
                })
            })
        }
    }catch(e){

    }
    
    // console.log('收到的整個Data:',request.body,'username:',request.body.username) //POST時拿Form data
})

app.post('/signIn',async function(request, response){
    response.setHeader('Access-Control-Allow-Origin','*')
    let {username, password, cartList} = request.body
    let SECRET = 'newToken'
    try {
        let foundUser = await User.findOne({username})
        if (foundUser) {
            bcrypt.compare(password, foundUser.password, async (err, result)=>{
                if (err) {
                    console.log('登入失敗:',err)
                }
                if (result === true) {
                    //登入成功
                    // let cartListInDB = foundUser.cartProducts
                    // let cartListInfront = cartList
                    if(foundUser.token) {
                        //若有token則不再給予
                        response.status(200).json({ login_msg:'登入成功', login_success:true, token:foundUser.token })
                        console.log(foundUser.username,'登入了')
                        // console.log(cartList)
                        // foundUser.cartProducts
                        return
                    }
                    //給予該user token
                    const token = jwt.sign({ _id: foundUser._id.toString() }, SECRET)
                    foundUser.token = token
                    foundUser = await foundUser.save()
                    // response.json({username})
                    response.status(200).json({ login_msg:'登入成功', login_success:true, token:foundUser.token })
                    console.log(foundUser.username,'登入了')
                } else {
                    response.status(200).json({ login_msg:'登入失敗，帳號或密碼錯誤', login_success:false})
                    
                }
            })
        } else {
            response.status(200).json({ login_msg:'登入失敗，帳號或密碼錯誤', login_success:false})
            console.log('登入失敗',foundUser.username,'帳密錯誤')
        }
    } catch (e){

    }

    // console.log('收到的整個Data:',request.body,'username:',request.body.username) //POST時拿Form data
})

app.post('/buyAction',async function(request, response) {
    let {token,buyList,totalPrice} = request.body
    let buyInfo = {
        buyList:buyList,
        totalPrice:totalPrice
    }
    try {
        let foundUser = await User.findOne({token})
        if (foundUser) {
            foundUser.order.push(buyInfo)
            foundUser = await foundUser.save()
            response.status(200).json({ msg:'訂單成功', order_success:true})
            console.log(foundUser.username+' 訂單交易成功')
        } else {
            response.status(200).json({ msg:'交易失敗，請聯絡server管理員', order_success:false})
            console.log('交易失敗')
        }
    } catch(e) {
        console.log('發生錯誤:',e)
    }
})

app.post('/getOrderHistory',async function(request, response) {
    let {token} =request.body
    // console.log('SIGNUP.body',request.body)
    // console.log('SIGNUP.query',request.query)
    // console.log('SIGNUP.params',request.params)
    try {
        //先查找該token是哪位使用者
        let foundUser = await User.findOne({token})
        let targetOrders = foundUser.order||null
        if (foundUser.order.length) {
            //若有訂單則返回訂單
            response.status(200).json({ msg:'查詢訂單成功', getOrders_success:true, targetOrders})
            console.log(`查詢訂單成功，已返回${foundUser.username}的訂單紀錄`)
        } else {
            //若無訂單則返回null
            response.status(200).json({ msg:'查無訂單', getOrders_success:true, targetOrders})
            console.log(`查詢訂單成功，目前${foundUser.username}無訂單`)
        }
    } catch(e) {
        console.log('發生錯誤:',e)
    }
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


// ----------------------------------------------------筆記------------------------------------------------------------
// 後端express用get且request.query接收，
// 且後端路由為app.get('/getOrderHistory',async function(request, response)時:
// export const reqGetOrderHistory = token => localDBRequest.get('/member/getOrderHistory',{params:{token}});

// 後端express用get且request.params接收，
// 且後端路由為app.get('/getOrderHistory/:token',async function(request, response)時:
// export const reqGetOrderHistory = token => localDBRequest.get(`/member/getOrderHistory/${token}`);

// 後端express用post且request.body接收:
// export const reqGetOrderHistory = token => localDBRequest.get('/member/getOrderHistory', {token});

app.listen(5000,()=>{
    console.log("已啟動，5000端口監聽中")
})