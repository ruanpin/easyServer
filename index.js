let express = require("express")
// let multer  = require('multer')
const mongoose = require('mongoose');
// import mongoose from 'mongoose';



const app = express()
// let upload = multer()

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
const exampleSchema = new mongoose.Schema({
    name:String,
    age:Number
})    

//為資料定義限制
const Example = mongoose.model("Example", exampleSchema)

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
Example.find({}).then((data)=>{
    console.log(data)
})

app.use(express.urlencoded({ extended: true }))//收Form data 用 (POST)


app.get('/testGet',function(request, response){
    response.setHeader('Access-Control-Allow-Origin','*')
    // response.send("Hello EXPRESS by GET")
    console.log(request.query)//GET時拿Form data
})

app.post('/testPost',function(request, response){
    response.setHeader('Access-Control-Allow-Origin','*')
    // response.send("Hello EXPRESS by POST")
    console.log('收到的整個Data:',request.body,'username:',request.body.username) //POST時拿Form data
})

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