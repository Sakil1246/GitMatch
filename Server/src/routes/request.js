const express = require('express');
const requestRouter=express.Router();
const {authUser}=require("../middlewares/auth");
const ConnectionRequest=require("../model/connectionRequest");
const User=require("../model/user");
const connectionRequest = require('../model/connectionRequest');

requestRouter.post("/request/send/:status/:userId",authUser,async(req,res)=>{
    try{
        const status=req.params.status;
        const toUserId=req.params.userId;
        const fromUserId=req.user._id;

        const istoUserId=await User.findById(toUserId);
        if(!istoUserId){
           return res.status(404).json({
                message:"User not found"
            })
        }

        const isAllowed=["ignore","interested"];
        if(!isAllowed.includes(status)){
            return res.status(400).json({
                message:"Invalid connection status "+status
            })
        }


        const name=await User.findById(toUserId);
       // const {firstName}=name;

        const existingRequst=await ConnectionRequest.findOne({
            $or:[{fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}]
            
        });
        if(existingRequst){
            return  res.status(400).send({
                message:"Connection request already exists"
            })
        }

        
        const connection=new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
            
        });
        const data=await connection.save();
        res.json({
            message:(req.user.firstName)+" "+status+" "+ name.firstName,
            data
        })
       
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }

});



requestRouter.post("/request/review/:status/:requestId",authUser,async(req ,res)=>{
    try{
        const {status,requestId}=req.params;
        const loggedInUser=req.user;
        const allowedStatus=["accepted","rejected"];
       

         if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status "+status
            })
        }
        const getconnection=await connectionRequest.findOne({
            fromUserId:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })
        if(!getconnection){
            return res.status(400).json({
                message:"Request not found"
            })
        }
        getconnection.status=status;
        const data=await getconnection.save();
        res.json({
            message:"Request "+status,
            data
        })
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})
    
module.exports=requestRouter;