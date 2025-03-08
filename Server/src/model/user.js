const { hash } = require('bcrypt');
const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const UserSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
       
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid");    
    }},},
    password:{
        type:String
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others",""].includes(value)){
                throw new Error("gender data is not valid");
        }
        }
    },
    photoUrl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzCb4DonWw5pT1-A3Su9HzG6TTN4nMOmj7tg&s"
    },
    about:{
        type:String,
        default:"Hey there! I am using Social Media App"
    },
    skills:{
        type:[String]
    },
},
{
    timestamps:true
    
});

UserSchema.index({firstName:1,lastName:1});

UserSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"sakil@ahmed",{expiresIn:"1d"});
    return token;
}
UserSchema.methods.validatePassword=async function(userinputPassword){
    const user=this;
    const hashPassword=user.password;
    const isPassword=await bcrypt.compare(userinputPassword,hashPassword);
    return isPassword;
}
module.exports=mongoose.model("User",UserSchema);