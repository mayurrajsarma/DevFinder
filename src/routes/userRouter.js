const express = require("express") ;
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router() ;

//shows all the pending requets
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

//shows all the connections of the user 
userRouter.get("/user/connection",userAuth,async (req,res)=> {
    try {
        const loginUser = req.user ;
        const connections = await ConnectionRequest.find({
            $or:[
                {fromUserId:loginUser._id,status:"accept"},
                {toUserId:loginUser._id,status:"accept"},
            ]
        })
        .populate("fromUserId", "firstName lastName")
        .populate("toUserId", "firstName lastName")

        const data = connections.map(rows=> {
            //or we can use: rows.fromUserId._id.toString()===loginUser._id.toString()
            if(rows.fromUserId._id.equals(loginUser._id)){
                return rows.toUserId;
            }
            return rows.fromUserId ;
        })

        res.json({
            message: "Data fetched successfully",
            data: data,
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message) ;
    }
})

module.exports = userRouter ;