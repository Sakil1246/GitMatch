const validator=require('validator');

const validateSignUpData=(req)=>{
    const {email,password,firstName,lastName}=req.body;
    const emailValid= validator.isEmail(email);
    if(!emailValid){
        return {error:"Invalid email"};
    }
    const passwordValid=validator.isStrongPassword(password);
    if(!passwordValid){
        return {error:"Password is not strong"};
    }
    if(!firstName || !lastName){
        return {error:"First name and last name are required"};
    }   
    if(!firstName.lenghth>50 && ! firstName.length<2){
        return {error:"First name should be between 2 and 50 characters"};
    }
    

}

const validateProfile=(req)=>{
    const allowedFields=["firstName","lastName","email","age","gender","about","skills","photoUrl"];
    const isAllowed=Object.keys(req.body).every((field)=>allowedFields.includes(field));
    // if(!isAllowed){
    //     throw new Error("Invalid update request field");

    // }
    return isAllowed;


}
module.exports={
    validateSignUpData,
    validateProfile
}