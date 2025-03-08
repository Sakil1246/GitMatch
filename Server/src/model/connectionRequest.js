const mongoose = require('mongoose');
const User=require("./user");
const connectionRequest=mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        requires:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        requires:true
    },
    status:{
        type:String,
        enum:{
            values:["ignore","interested","accepted","rejeected"],
            message:"{VALUE} is not supported"
        }
    }
}, {
    timestamps:true});
//Runs before a document is saved to the database.
connectionRequest.pre("save",function(next){
    const connection=this;
    if(connection.fromUserId.equals(connection.toUserId)){
        throw new Error("You can not send connection request to yourself");
    }
    next();
})


module.exports=mongoose.model("ConnectionRequest",connectionRequest);