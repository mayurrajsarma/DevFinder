const express = require('express') ;
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser") ;
require("dotenv").config();
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter") ;

const app = express();

app.use(express.json()) ;//middleware json to JS object converter
app.use(cookieParser()) ;  

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);


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

 