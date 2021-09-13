const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
    promoCode : {
        type : String,
        required : true,
        unique : true
    },
    promoName : {
        type : String,
        required : true
    },
    promoPCode : {
        type : String,
        required : true
    },
    promoPCategory : {
        type : String,
        required : true,
        enum : ["BEVERAGES", "BREAD-BAKERY", "BREAKFAST-CEREAL", "CANNED_GOODS", "CONDIMENTS", "COOKIES-SNACKS-CANDY", "DAIRY-EGG-CHEESE", "FROZEN_FOODS", "FRUITS-VEGETABLES", "MEAT-SEAFOOD", "MISCELLANEOUS", "CLEANING_SUPPLIES"]
    },
    promoType : {
        type : String,
        required : true,
        enum : ["DISCOUNT", "FREE PRODUCTS"],
        default : "DISCOUNT"
    },
    promoDiscount : {
        type : String,
        default : ""
    },
    promoFPCode : {
        type : String,
        default : ""
    },
    promoFPAmount : {
        type : String,
        default : ""
    },
    promoStartDate : {
        type : String,
        required : true
    },
    promoEndDate : {
        type : String,
        required : true
    },
    promoImage : {
        data : Buffer,
        contentType : String
    }
}, { timestamps : true });

module.exports = mongoose.model("promotion", productionSchema)