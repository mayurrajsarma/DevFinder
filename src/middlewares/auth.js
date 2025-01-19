const jwt = require("jsonwebtoken") ;
const User = require("../models/user") ;

const userAuth = async (req,res,next)=> {
    try {
        //Read the token from the req
        const cookie = req.cookies ;
        const {token} = cookie ;
        if(!token) {
            return res.status(401).send("Please login") ;//401=> unauthorised  
        }

        //validate the token
        const decodedObj = await jwt.verify(token,"MR@DEV11") ;
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