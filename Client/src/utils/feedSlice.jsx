import { createSlice } from "@reduxjs/toolkit";

const feedSlice=createSlice({
    name:"feed",
    initialState: null,
    reducers:{
        addFeed:(state,action)=>action.payload,
        removeFeed:(state,action)=>{
            const newFeeed=state.filter((post)=>post._id !==action.payload);
            return newFeeed;
        }
    }

})
export const{addFeed,removeFeed}=feedSlice.actions;
export default feedSlice.reducer;