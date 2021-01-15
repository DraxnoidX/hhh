let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let scheduledEventsSchema = new Schema({
    date:{
        type: Date,
        required: true
    },
    typeOfAction:{
        type: String,
        required: true
    },
    requestId:{
        type: Number,
        required: true,
        unique:true
    },
    toBeDeleted:{
        type: Boolean,
        default:false
    }
});

module.exports = mongoose.model('ScheduledEvents',scheduledEventsSchema);