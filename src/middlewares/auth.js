const jwt = require("jsonwebtoken") ;
const User = require("../models/user") ;

const userAuth = async (req,res,next)=> {
    try {
        //Read the token from the req
        const cookie = req.cookies ;
        const {token} = cookie ;
        if(!token) {
            throw new Error("Invalid Token") ;   
        }

        //validate the token
        const decodedObj = await jwt.verify(token,process.env.SECRET_KEY) ;
        const {_id} = decodedObj ;
        
        //Find the user
        const user = await User.findById({_id:_id}) ;
        //token is valid but user doesnt exist in our db
        if(!user) {
            throw new Error("User does not exist") 
        }
        req.user = user ;
        next() ;

    } catch (err) {
        res.status(400).send("ERROR: " + err.message) ;
    }
}

module.exports = {
    userAuth,
};