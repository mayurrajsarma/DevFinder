const express = require('express') ;
const connectDB = require("./config/database");

const app = express();

connectDB().then(()=>{
   console.log("Database connection successfull") ;
   app.listen(3000,()=>{
      console.log("Server is successfully listening on port 3000")
   }) ;
})
.catch((err)=> {
   console.error("Database did not connect")
})

 