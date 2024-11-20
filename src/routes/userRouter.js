const express = require("express") ;
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router() ;

userRouter.get("/user/request/received",userAuth,async (req,res)=> {
    try {
        const loginUser = req.user ;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loginUser._id,
            status: "interested"
        }).populate("fromUserId","firstName lastName") ;
        
        res.json({
            message: "Data fetched successfully",
            data: connectionRequest,
        })
    } catch (err) {
        res.status(400).send("ERROR: " + err.message) ;
    }
})

module.exports = userRouter ;