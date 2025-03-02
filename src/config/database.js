const mongoose = require("mongoose") ;

const url = "mongodb+srv://mayurrajsarma:N3EMKwLHWrbEMVCz@devfindercluster.co6uh.mongodb.net/devFinder" ;


const connectDB = async()=> {
    // await mongoose.connect(process.env.DB_CONNECTION_SECRET) ;
    await mongoose.connect(url);
    // console.log(process.env.DB_CONNECTION_SECRET)  ;
};

module.exports = connectDB ; 

