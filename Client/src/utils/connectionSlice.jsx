import { createSlice } from "@reduxjs/toolkit";

const connectionSlice=createSlice({
    name: 'connections',
    initialState: null,
    reducers:{
        addConnection:(state,action)=>action.payload,
        removeconnection:()=>null
    }
}
)
export const{addConnection,removeconnection}=connectionSlice.actions;
export default connectionSlice.reducer;