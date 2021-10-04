const mongoose = require('mongoose');
const { AdvertisementId } = mongoose.Schema;

const advertisementSchema = new mongoose.Schema({
    adCode : {
        type : String,
        required : true,
        unique : true
    },
    adName : {
        type : String,
        required : true,
        trim : true
    },
    adStartDate : {
        type : Date,
        required : true
    },
    adEndDate : {
        type : Date,
        required : true
    },
    adImage : {
        data : Buffer,
        contentType : String
    }
}, { timestamps : true });

module.exports = mongoose.model("advertisement", advertisementSchema);