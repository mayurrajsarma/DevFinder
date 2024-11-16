const mongoose = require("mongoose") ;

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
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