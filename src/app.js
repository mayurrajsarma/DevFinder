const express = require('express') ;
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation") ;
const bcrypt = require("bcrypt") ;
const cookieParser = require("cookie-parser") ;
require("dotenv").config();
const {userAuth} = require("./middlewares/auth") ;
const jwt = require("jsonwebtoken") ;

const app = express();

app.use(express.json()) ;//middleware json to JS object converter
app.use(cookieParser()) ;  


app.post("/signup",async (req,res)=> {
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
app.post("/login", async (req,res)=> {
   try {
      const {emailId,password} = req.body ;
      const user = await User.findOne({emailId: emailId}) ;
      if(!user) {
         throw new Error("Invalid credentials");
      }
      const isPasswordValid = await bcrypt.compare(password,user.password) ;
      if(isPasswordValid) {
         //create a JWT token
         const token = await jwt.sign({_id:user._id},process.env.SECRET_KEY,{expiresIn: '8h'}) ;

         //Add the token to cookie and send the response back to the user
         res.cookie("token",token,{
            expires: new Date(Date.now() + 8 * 3600000),
         }) ;

         res.send("Login Successfull !")
      }
      else {
         throw new Error("Invalid credentials") ;
      }
   } catch (error) {
      res.status(400).send("ERROR: " + error.message) ;
   }
})

//profile
app.get("/profile",userAuth,async (req,res)=> {
   try {
      const user = req.user ;
      res.send(user) ;
   } catch (err) {
      res.status(400).send("ERROR: " + err.message) ;
   }
});

//sending a connection req


app.get("/user", async (req,res)=> {
   const userEmail = req.body.emailId;
   try {
      const user = await User.find({emailId:userEmail}) ;
      if(user.length===0) {
         res.status(404).send("User not found!");
      }
      else res.send(user);
   } catch (err) {
      res.status(400).send("Something went wrong!");
   }
});

app.delete("/user",async (req,res)=> {
   const userId = req.body.id ;
   try {
      const user = await User.findByIdAndDelete(userId) ;
      res.send("User deleted successfully");
   } catch (err) {
      res.status(400).send("Something went wrong");
   }
});

//To get all the user
app.use("/feed",async (req,res)=> {
   try {
      const allUsers = await User.find({}) //empty filter will give all the documents
      res.send(allUsers) ;
   } catch (err) {
      res.status(400).send("Something went wrong!");
   }
})

//update data of the user
app.patch("/user/:Id",async (req,res)=> {
   const userId = req.params?.Id ;
   const data = req.body ;
   try{
      const ALLOWED_UPDATES = [
         "about",
         "skills"
      ]

      const isUPDATE_ALLOWED = Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k)) ;
      if(!isUPDATE_ALLOWED) {
         throw new Error("UPDATE NOT ALLOWED")
      }
      if(data?.skills.length>10) {
         throw new Error("Skills can't be more than 10") ;
      }
      await User.findByIdAndUpdate({_id:userId},data, {
         runValidators:true,
      }) ;
      res.send("User updated successfully") ;
   }
   catch (err) {
      res.status(400).send("Something went wrong: " + err.message);
   }
})

connectDB().then(()=>{
   console.log("Database connection successfull") ;
   app.listen(3000,()=>{
      console.log("Server is successfully listening on port 3000")
   }) ;
})
.catch((err)=> {
   console.error("Database did not connect")
})

 