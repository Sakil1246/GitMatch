const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authUser=async(req,res,next)=>{
   try{
     const {token}=req.cookies;
    if(!token){
        return res.status(401).send("Please login!!");;
    }
    const decodeMessage=await jwt.verify(token,"sakil@ahmed");
    const {_id}=decodeMessage;
    const user=await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }
    req.user=user;
    next();
}catch(err){
        res.status(400).send("ERROR:"+err.message);
    }
}
module.exports={
    authUser,
}