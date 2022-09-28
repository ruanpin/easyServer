const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type:String,
    },
    password:{
        type:String,
    },
    token:{
        type:String
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;


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