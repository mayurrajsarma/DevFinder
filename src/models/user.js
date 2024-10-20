const mongoose = require('mongoose') ;
const validator = require('validator') ;

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
            trim: true,
            validate(email){
                if(!validator.isEmail(email)) {
                    throw new Error("Invalid Email address: " + email) ;
                }
            }
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
            validate(value) {
                if(!validator.isStrongPassword(value)) {
                    throw new Error("Password must contain atleast one uppercase,lowercase,number and symbol") ;
                }
                // { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
            }
        },
        about:{
            type: String,
            maxLength:150
        },
        skills: {
            type: [String]
        },
        age: {
            type: Number,
            min: 18 
        },
        gender: {
            type: String,
            validate(value) {
                if(!["Male","Female","others"].includes(value)) {
                    throw new Error("Invalid Gender") ;
                }
            }
        },
        photoUrl: {
            type:String,
            default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQJxKGGpPc9-5g25KWwnsCCy9O_dlS4HWo5A&s",
            validate(value) {
                if(!validator.isURL(value)) {
                    throw new Error("Invalid photo URL") ;
                }
            }
        }
    },
    {
        timestamps: true
    },
);

//user schema method
userSchema.methods.getJWT = async function() {
    const user = this ;
    const token = await jwt.sign({_id:user._id},process.env.SECRET_KEY,{expiresIn: '8h'}) ;
    return token ;
};

//mongoose.model(modelName, schema)
const UserModel = mongoose.model("User",userSchema) ;
module.exports = UserModel ;