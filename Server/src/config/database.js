

const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://Sakil_Ahmed:n1IqRao6gubTxmeQ@cluster0.odfho.mongodb.net/");
};


module.exports=connectDB;