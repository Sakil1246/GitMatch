const express=require("express");
const userRouter=express.Router();

const {authUser}=require("../middlewares/auth");
const User=require("../model/user");
const connectionRequest=require("../model/connectionRequest");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";


userRouter.get("/user/requests/received",authUser,async (req,res)=>{
    try{
        const loggedUser=req.user;
        const findpeople=await connectionRequest.find({
            toUserId:loggedUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","about"])
        
        res.json({
            message:"Data fetchded successfully",
            data:findpeople
    });
    }
    catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})


userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName about photoUrl") // Explicitly select fields
      .populate("toUserId", "firstName lastName about photoUrl"); // Explicitly select fields

    console.log("Fetched Connections:", JSON.stringify(connectionRequests, null, 2));

    const data = connectionRequests
      .map((row) => {
        if (!row.fromUserId || !row.toUserId) return null;

        return row.fromUserId._id.toString() === loggedInUser._id.toString()
          ? row.toUserId
          : row.fromUserId;
      })
      .filter(Boolean); // Remove any null values

    res.json({ data }); // This should now return full user objects
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});



userRouter.get("/feed", authUser, async (req, res) => {
    try {
      const loggedInUser = req.user;
  
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit;
      const skip = (page - 1) * limit;
  
      const connectionRequests = await connectionRequest.find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      }).select("fromUserId  toUserId");
  
      const hideUsersFromFeed = new Set();
      connectionRequests.forEach((req) => {
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
      });
  
      const users = await User.find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
  
      res.json({ data: users });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
module.exports=userRouter;