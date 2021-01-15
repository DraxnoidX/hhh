let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let classRoomSchema = new Schema({
    maxCapacity:{
        type: Number,
        required: true
    },
    roomId:{
        type: String,
        required: true,
        unique:true
    },
    schedule: {
        type: Array,
        default: [['Saturday',null,null,null,null,null],['Sunday',null,null,null,null,null],
        ['Monday',null,null,null,null,null],['Tuesday',null,null,null,null,null],
        ['Wednesday',null,null,null,null,null],['Thursday',null,null,null,null,null]]
    },
    type : {
        type : String ,
        required : true
    }
});

module.exports = mongoose.model('Classroom',classRoomSchema);