let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let requestSchema = new Schema({
    requestId:{
        type: Number,
        required: true,
        unique: true
    },
    //default attributes
    staffId:{
        type: String,
        required:true
    },
    requestType:{ //request type: replacement - changeDayOff - slotLink - accidentalLeave - maternityLeave - sickLeave - compensationLeave
        type: String,
        required: true
    },
    reason:{
        type: String,
        default: ""
    },
    departmentId:{
        type:String
    },
    acceptanceStatus:{ // pending - accepted - rejected
        type: String,
        default: "pending"
    },
    //replacement attributes
    replacementStaffId:{
        type: String,
    },
    repAcceptanceStatus:{
        type: String,
        default: "pending"
    },
    //slot linking attributes
    courseID:{
        type: String
    },
    roomNumber:{  ///Room ID
        type: String
    },
    tutorialNumber:{
        type:Number
    },
    day:{
        type:String
    },
    slot:{
        type:Number
    },
    //change day off attributes
    newDayOff:{
        type: String
    },
    //Maternity and Sick leaves documents link
    documentLink:{
        type:String,
        default: "",
    },
    //timestamp for stuff
    timestamp:{
        type: Date,
        required: true
    },
    weekDay:{
        type: String
    },
    requestDay:{
        type: Date
    }
});

module.exports = mongoose.model('Request',requestSchema);