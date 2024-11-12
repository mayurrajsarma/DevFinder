const validator = require("validator") ;

const validateSignUpData = (req)=> {
    const {firstName,lastName,emailId,password} = req.body ;
    if(!firstName) throw new Error("Firstname is empty!");
    else if(!lastName) throw new Error("Lastname is empty!");
    else if(!validator.isEmail(emailId)) {
        throw new Error("Email is not valid!");
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong!") ;
    }
};

const validateEditProfileData = (req)=> {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills",
    ];

    const isEditAllowed = Object.keys(req.body).every(field=>allowedEditFields.includes(field)) ;
    return isEditAllowed ;

}

module.exports = {
    validateSignUpData,validateEditProfileData
};