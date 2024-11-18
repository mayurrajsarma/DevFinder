const express = require("express") ;
const requestRouter = express.Router() ;
const {userAuth} = require("../middlewares/auth") ;
const ConnectionRequest = require("../models/connectionRequest") ;
const User = require("../models/user") ;

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=> {
    try {
        const fromUserId = req.user._id ;
        const toUserId = req.params.toUserId ;   
        const status = req.params.status ;

        //#1 if the user we are sending request to doesnot exist
        const toUser = await User.findById(toUserId) ;
        if(!toUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        //#2 only these two status allowed
        const allowedStatus = ["ignored","interested"] ;
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type"}) ;
        }

        //#3
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId,toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ],
        });
        if(existingConnectionRequest) {
            return res.status(400).json({message: "Connection request already exist"}) ;
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        
        const data = await connectionRequest.save();// save to the db
        
        res.json({
            message: "Connection Request sent from " + req.user.firstName + " to " + toUser.firstName + ", status: " + status,
            data,
        });

    } catch (err) {
        res.status(400).send("ERROR: " + err.message) ;
    }
})

requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=> {
    try {
        const user = req.user ;
        const status = req.params.status ;
        const requestId = req.params.requestId ;
        
        const allowedStatus = ["accept","reject"] ;
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: "Invalid status type"}) ;
        }

        const loginUserId = user._id ;
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId: loginUserId,
            status: "interested",
        }) ;

        if(!connectionRequest) {
            return res.status(400).json({message: "Connection request not found!"}) ;
        }

        connectionRequest.status = status ;
        const data = await connectionRequest.save() ;
        res.json({
            message: "Request: " + status ,
            data
        });

    } catch (err) {
        res.status(400).send("ERROR: " + err.message) ;
    }
})

module.exports = requestRouter ;
