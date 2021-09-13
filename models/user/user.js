const mongoose = require('mongoose');
const crypto = require('crypto');
const { v1: uuidv1 } = require('uuid');

const CustomerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },

    lastname: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },

    email: {
        type: String,
        trim: true,
        required: true,
        unique: 32
    },

    phoneno: {
        type: String,
        trim: true,
        required: true,
        unique: 15
    },

    addressl1: {
        type: String,
        trim: true,
        required: true,
        maxlength: 40
    },
    addressl2: {
        type: String,
        trim: true,
        required: true,
        maxlength: 40
    },

    city: {
        type: String,
        trim: true,
        required: true,
        maxlength: 40
    },
    postalcode: {
        type: String,
        trim: true,
        required: true,
        maxlength: 40
    },

    hashed_password: {
        type: String,
        required: true,
    },

    about: {
        type: String,
        trim: true,
    },
    
    salt: String,
    role: {
        type: Number,
        default: 0
    },

    history: {
        type: Array,
        default: []
    }

}, {timestamps: true});

// virtual field

CustomerSchema
.virtual('password')
.set(function(password){
    this._password = password
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
})
.get(function(){
    return this._password;
});

CustomerSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },


    encryptPassword: function(password) {
        if(!password) return '';
        try{
            return crypto.createHmac('sha1', this.salt)
                            .update(password)
                            .digest('hex');
        } catch (err) {
            return "";
        }
    }
};

module.exports = mongoose.model("user", CustomerSchema);