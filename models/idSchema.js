let mongoose = require('mongoose');


const idSchema = new mongoose.Schema({
    id : {
        type : Number,
        default:1 
    },
    staffId:{
       type:Number,
       default: 0
    },
    hrId:{
     type:Number,
     default:0
    }
});

module.exports = mongoose.model("ID",idSchema);