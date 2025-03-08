const express=require("express");
const connectDB=require("./config/database");
const app=express();
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user");
const cors=require("cors");


const cookieParser=require("cookie-parser");




app.use(cors({
    origin:"http://localhost:5174",
    credentials:true,//to get the tokrn in cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"] 
}))
// app.options("*", (req, res) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:5173");  // Match frontend origin
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.sendStatus(200);
// });
app.use(express.json());
app.use(cookieParser());
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);





connectDB().then(()=>{
    console.log("Database is connected");
    app.listen(3333,()=>{
        console.log("Server  is succesfully listening port 3333 ");
    })
}).catch((err)=>{
    console.log("Database is not connected");
});











