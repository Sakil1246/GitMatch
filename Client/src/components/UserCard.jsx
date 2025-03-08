import React from 'react'
import { BasicURL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeFeed } from '../utils/feedSlice';
import axios from 'axios';

const UserCard = ({user}) => {
    
    const {_id,firstName, lastName, photoUrl, gender, age, about} = user;

    const dispatch=useDispatch();
    const handleStatus=async(status,userId)=>{
      try{

        const res=await axios.post(BasicURL+"/request/send/"+status+"/"+userId,{},{withCredentials:true});
        dispatch(removeFeed(_id));

      }catch(err){
        console.log("Failed to update status");
        console.log(err);
      }
    }
  return (
    <div className="card bg-base-300 w-96 shadow-xl flex justify-center mt-10">
  <figure>
    <img
      src={photoUrl}
      alt="Profile" />
  </figure>
  <div className="card-body">
   <h2 className="card-title">{firstName+" "+lastName}</h2>
    {gender && age &&<p>{gender+","+age}</p>}
    <p>{about}</p>
    <div className="card-actions justify-end">
    <button className="btn btn-primary" onClick={()=>handleStatus("ignore",_id)}>Ignore</button>
      <button className="btn btn-secondary" onClick={()=>handleStatus("interested",_id)}>Interested</button>
    </div>
  </div>
</div>
  )
};

export default UserCard;
