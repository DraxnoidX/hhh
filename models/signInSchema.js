let mongoose = require('mongoose');


const signInSchema = new mongoose.Schema({
    staffId:{
        type:String,
        required:true,
        unique:true
    },
    days : {
        type : [[String]],
        default:[[]] 
    },
    hours:{
        type: [[Number]],
        default:[[]]
    },
    currentMonth:{
        type:[String],
        default:[]
    },
    // singInOut:{
    //     type:[[[String]]],
    //     default:[[[]]]
    // },
    // timeStamp:{
    //     type:[[[Number]]],
    //     default:[[[0,0]]]
    // }
    signInStamp:{
        type:[Number],
        default:[0,0]
    }
});

module.exports = mongoose.model("SignIn",signInSchema);