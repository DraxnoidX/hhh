let mongoose = require('mongoose');
const departmentSchema = require('./departmentSchema').departmentSchema;
let Schema = mongoose.Schema;

var facultySchema = new Schema({
    name:{
        type: String,
        required: true,
        unique:true
    },
    id:{
       type: Number,
       required:true,
       unique:true
    },
    departments: [String]
});

module.exports = mongoose.model('Faculty',facultySchema);