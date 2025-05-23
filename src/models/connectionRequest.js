const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  //Reference to the user collection
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", 
    },
    status: {
        type: String,
        required: true,
        enum: {  //Custom Validation
            values: ["ignored", "interested", "accepted", "rejected"],
            message : `{VALUE} is incorrect status type`
        }
    }
},
{
    timestamps: true,
}
);

connectionRequestSchema.index({fromUserId:1, toUserId: 1}); //This is called compound index

connectionRequestSchema.pre('save', function(next){                       //arrow wont work
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
       throw new Error("Cant send a request to yourself")
    } 
    next();
})

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)

module.exports = ConnectionRequestModel