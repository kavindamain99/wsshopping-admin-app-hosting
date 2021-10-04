const mongoose = require('mongoose');

const statusSchema = mongoose.Schema({

    userid:{
        type: 'string',
        trim:true,
        required:true
    },
    username:{
        type: 'string',
        trim:true
    },
    cancel: {
        type: Number,
        required:true
    },
    progressing: {
        type: Number,
        required:true
    },
    completed: {
        type: Number,
        required:true
    }



},{timestamps:true})

module.exports = mongoose.model('order-status',statusSchema);