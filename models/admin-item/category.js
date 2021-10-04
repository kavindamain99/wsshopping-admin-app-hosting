const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({

    category:{
        type:String,
        trim:true,
        maxLength:32,
        unique:true,
    }



},{timestamps:true});
    
module.exports = mongoose.model("web-category",categorySchema);