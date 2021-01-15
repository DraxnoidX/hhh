let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let departmentSchema = new Schema({
    HOD:{
        type: String,
        required: true
    },
    courses:[String],
    id : {
        type: String,
        unique: true
    },
    staff: [String],
    facultyName:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Department',departmentSchema);
module.exports.departmentSchema = departmentSchema;