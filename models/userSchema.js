let mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    id:{
        type: String,
        unique: true,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    gender: {
        type: String,
        required: false
    },
    type:{
        type:String,
        default: 'Staff Member'
    },
    notifications:{
        type:[String]
    },
    faculty: {
        type: String,
        required: false
    },
    department: {
        type: String,
        required: false
    },
    courses : {
        type : [String]
    },
    salary: {
        type: Number,
        required: false
    },
    monthPayOff: {
        type: Number
    },
    daysOff: {
        type : [String],
        default: ["Friday",null]
    },
    missingDays:[String],
    extraHours:{
        type:Number,
        default:0
    },
    missingHours:{
        type:Number,
        default:0
    },
    annualLeaves:{
        type:Number,
        default:2.5
    },
    accidentalLeaves:{
        type:Number,
        default:6
    },
    maternityDaysLeft:{
        type: Number,
        default:0
    },
    officeLocation:{
        type:String,
        required:true
    },
    schedule :{
        type : Array,// [[days,slot]]
        default: [['Saturday',null,null,null,null,null],['Sunday',null,null,null,null,null],
        ['Monday',null,null,null,null,null],['Tuesday',null,null,null,null,null],
        ['Wednesday',null,null,null,null,null],['Thursday',null,null,null,null,null]]
    } 
});

module.exports = mongoose.model("User",userSchema);