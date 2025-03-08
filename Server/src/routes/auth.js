const express = require('express');
const authRouter=express.Router();
const User=require("../model/user");
const {validateSignUpData}=require("../utils/validation");
const bcrypt=require("bcrypt");
const multer = require('multer');
require("dotenv").config();
const cloudinary = require('cloudinary').v2;



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  
  const storage = multer.memoryStorage();
  const upload = multer({ storage });


  authRouter.post("/upload", upload.single("file"), async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload_stream({ folder: "profile_images" }, (error, result) => {
        if (error) return res.status(500).json({ message: "Upload failed", error: error.message });
        res.json({ imageUrl: result.secure_url });
      }).end(req.file.buffer);
    } catch (error) {
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  });

authRouter.post("/signup", async (req, res) => {
   
    try {
        //validate the data
        validateSignUpData(req);
        const { email, password, firstName, lastName ,photoUrl} = req.body;
        // encrypting password
        const hashPassword=await bcrypt.hash(password,10);
        const user = new User({
            email,
            password:hashPassword,
            firstName,
            lastName,
            photoUrl
        });
        const userSave=await user.save();
        const token=await userSave.getJWT();
        // console.log(token);
        //add the token to cookie and send the response back to the user
        res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
        // res.send(user);
       res.json({message :"User registered successfully",userSave});
    } catch (err) {
        res.status(400).send("ERROR: "+err.message);
    }
});

authRouter.post("/login",async(req,res)=>{
    try{
    const {email,password}=req.body;
    const user=await User.findOne({email:email});
    if(!user){
        throw new Error("Invalid credentials");//throwing error if user not found in the database
    }
    // const isPassword=await bcrypt.compare(password,user.password);
    const isPassword=await user.validatePassword(password);
    if(!isPassword){
        throw new Error("Invalid credentials");
    }
    else{

        //cretaing a token
        //const token=await jwt.sign({_id:user._id},"sakil@ahmed",{expiresIn:"1d"});
        const token=await user.getJWT();
        // console.log(token);
        //add the token to cookie and send the response back to the user
        res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
        res.send(user);
    }
    
    
    
} catch(err){
    res.status(400).send("Error:"+err.message)
}});

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("Logout successfull");
})
module.exports=authRouter;
