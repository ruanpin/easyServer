let express = require("express")
// let multer  = require('multer')



const app = express()
// let upload = multer()

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