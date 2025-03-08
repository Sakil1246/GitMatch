const express = require('express');
const profileRouter=express.Router();
const {authUser}=require("../middlewares/auth");
const{validateProfile}=require("../utils/validation");


profileRouter.get("/profile/view",authUser,async(req,res)=>{
  try{    
    //const cookies=req.cookies;
    //console.log(cookies);
    //const {token}=cookies;
    // if(!token){
    //     throw new Error("Token is invalid");
    // }
    // const decodeMessage=await jwt.verify(token,"sakil@ahmed");
    // const {_id}=decodeMessage;
    // const user=await User.findById(_id);
    // if(!user){
    //     throw new Error("User not found");

    // }
     const user=req.user;
     res.send(user);


}catch(err){
    res.status(400).send("Error:"+err.message);
}});


profileRouter.patch("/profile/update",authUser,async(req,res)=>{
    try{

       if(!validateProfile(req)){
           throw new Error("Invalid update request field");
       }
       const user=req.user;
       Object.keys(req.body).forEach((update)=>user[update]=req.body[update]);
         await user.save();
         res.send(user);
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})
module.exports=profileRouter;