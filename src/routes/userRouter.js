const express = require("express") ;
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router() ;
const USER_SAFE_DATA = "firstName lastName age gender photoUrl skills about"
//shows all the pending requets
userRouter.get("/user/request/received",userAuth,async (req,res)=> {
    try {
        const loginUser = req.user ;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loginUser._id,
            status: "interested"
        }).populate("fromUserId",USER_SAFE_DATA) ;
        
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
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA)

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

userRouter.get("/user/feed",userAuth,async (req,res)=> {
    try {
        const loginUser = req.user ;
        const page = parseInt(req.query.page) || 1 ;
        let limit = parseInt(req.query.limit) || 10 ;
        limit = limit > 50 ? 50 : limit ;
        const skip = (page - 1) * limit ;

        const connectionRequests = await ConnectionRequest.find({
            // $or: [
            //     {fromUserId:loginUser._id},
            //     {toUserId:loginUser._id, $or:[{status:"ignored"},{status:"accept"},{status:"reject"}]}
            // ]
            $or: [
                {fromUserId:loginUser._id},{toUserId:loginUser._id}
            ]
        }).select("toUserId fromUserId")
        // .populate("fromUserId","firstName")
        // .populate("toUserId","firstName");

        const hideUserFromFeed = new Set() ;
        
        connectionRequests.forEach(req => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });
        // console.log(hideUserFromFeed);
        
        const user = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne: loginUser._id}}
            ]
        })
        .select(USER_SAFE_DATA).skip(skip).limit(limit) ;

        res.json({data:user}) ;
    } catch (err) {
        res.status(400).send("ERROR: " + err.message) ;
    }
})

module.exports = userRouter ;