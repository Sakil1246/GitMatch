import axios from 'axios'
import React, { useEffect } from 'react'
import { BasicURL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'
import UserCard from './UserCard'
const Feed = () => {
    const feeddata = useSelector((store) => store.feed);

    
    const dispatch = useDispatch();

    const getFeed = async () => {
        if (feeddata) return;
        try {
            const res = await axios.get(BasicURL + "/feed", { withCredentials: true });
           
            dispatch(addFeed(res.data.data));
        }
        catch (error) {
            console.log("Failed to fetch feed");
            console.log(error);
        }

    }
    useEffect(() => {
        getFeed();
    }, []);
    if (!feeddata) return null;
    if(feeddata.length <=0){
        return <h1 className='text-center text-white mt-10'>No new user found</h1>
    }
    return (
        feeddata && (<div className='flex justify-center'>
            <UserCard user={feeddata[0]} />
        </div>)
    )


}

export default Feed
