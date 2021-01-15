let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let courseSchema = new Schema({
    id:{
        type: String,
        required:true,
        unique:true
     },
    totalSlots:{
        type: Number,
        default: 0
    },
    totalSlotsTaken:{
        type: Number,
        default: 0
    },
    name:{
        type: String,
        required: true
    },
    staff: [String],
    department:{
        type:String
    },
    courseCoordinatorID:{
        type:String
    },
    schedule :{
        type : Array,// [[days,slot]]
        default: [['Saturday',[],[],[],[],[]],['Sunday',[],[],[],[],[]],
        ['Monday',[],[],[],[],[]],['Tuesday',[],[],[],[],[]],
        ['Wednesday',[],[],[],[],[]],['Thursday',[],[],[],[],[]]]
    } 
});

module.exports = mongoose.model('Course',courseSchema);