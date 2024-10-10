const mongoose = require("mongoose") ;

const url = "mongodb+srv://mayurrajsarma:N3EMKwLHWrbEMVCz@devfindercluster.co6uh.mongodb.net/devFinder"

const connectDB = async()=> {
    await mongoose.connect(url) ;
};

module.exports = connectDB ; 

