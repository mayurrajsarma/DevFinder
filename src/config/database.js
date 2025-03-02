const mongoose = require("mongoose") ;



const connectDB = async()=> {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET) ;
    // await mongoose.connect(url);
    // console.log(process.env.DB_CONNECTION_SECRET)  ;
};

module.exports = connectDB ; 

