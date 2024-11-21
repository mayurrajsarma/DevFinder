const mongoose = require("mongoose") ;

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //referance to the User collection
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum : {
            values: ["ignored","interested","accept","reject"],
            message: `{VALUE} is incorrect status type`
        },
    }}, 
    {
        timestamps: true,
    }
)

//compound indexing
connectionRequestSchema.index({toUserId:1,fromUserId:1}) ;

//will be called every time we save a new connection request 
//will be called before saving it to the DB
// pre is like a middleware we have to call next ;
connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this ;
    //connection request to self , validation
    //check if fromUserId and toUserId is same
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to self!");
        
    }
    next() ;
});

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",connectionRequestSchema
);

module.exports = ConnectionRequestModel ;