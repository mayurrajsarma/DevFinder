const express = require("express") ;
const {validateSignUpData} = require("../utils/validation") ;
const bcrypt = require("bcrypt") ;
const User = require("../models/user");


const authRouter = express.Router() ;

authRouter.post("/signup",async (req,res)=> {
    // console.log(req.body) ;
    // const userObj = {
    //    firstName: "Raj",
    //    lastName: "Mayur",
    //    emailId: "raj@sarma.com",
    //    password: "abcd123",
    //    age: "22",
    //    gender: "Male"
    // }
    
    try {
       //validation of data
       validateSignUpData(req) ;
       
       const {firstName,lastName,emailId,password,about,skills,age,gender,photoUrl} = req.body ;
       
       //encrypt the password
       const passwordHash = await bcrypt.hash(password,10)
       const user = new User({
          firstName,
          lastName,
          emailId,
          password: passwordHash,
          about,
          skills,
          age,
          gender,
          photoUrl
       }) ;//creating a new instance of the user model
       
       await user.save();//data will be saved onto db , it return a promise
       res.send("User added successfully!");
    } catch (error) {
       res.status(400).send("ERROR: " + error.message) ;
    }
});

//login
authRouter.post("/login", async (req,res)=> {
   try{
      const {emailId,password} = req.body ;
      const user = await User.findOne({emailId: emailId}) ;
      if(!user) {
         throw new Error("Invalid credentials");
      }
      // const isPasswordValid = await bcrypt.compare(password,user.password) ;
      
      //userSchema method implemented
      const isPasswordValid = await user.validatePassword(password) ;
      if(isPasswordValid) {
          
         //create a JWT token (now done in userschema method)
         //const token = await jwt.sign({_id:user._id},process.env.SECRET_KEY,{expiresIn: '8h'}) ;

         const token = await user.getJWT() ;

         //Add the token to cookie and send the response back to the user
         res.cookie("token",token,{
            expires: new Date(Date.now() + 8 * 3600000),
         }) ;

         res.send("Login Successfull !")
      }
      else {
         throw new Error("Invalid credentials") ;
      }
   }catch (error) {
      res.status(400).send("ERROR: " + error.message) ;
   }
})

authRouter.post("/logout", async (req,res)=> {
   res.cookie("token",null, {
      expires: new Date(Date.now()),
   });
   res.json({
      message: "Logged out successfully!",
   }) ;
});

module.exports = authRouter ;