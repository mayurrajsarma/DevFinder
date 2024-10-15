const mongoose = require('mongoose') ;
const userSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: true,
            maxLength: 20,
        },
        lastName: {
            type: String,
            maxLength: 20,
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minLength: 6
        },
        age: {
            type: Number,
            min: 18 
        },
        gender: {
            type: String,
            validate(value) {
                if(!["male","female","others"].includes(value)) {
                    throw new Error("Invalid Gender") ;
                }
            }
        },
    },
    {
        timestamps: true
    },
);



//mongoose.model(modelName, schema)
const UserModel = mongoose.model("User",userSchema) ;
module.exports = UserModel ;