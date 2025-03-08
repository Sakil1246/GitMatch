import axios from 'axios'
import React, { useEffect } from 'react'
import { BasicURL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequest, removeRequest } from '../utils/requestSlice'

const Request = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const fetchRequest = async () => {
    try {
      const res = await axios.get(BasicURL + "/user/requests/received", { withCredentials: true });
      dispatch(addRequest(res.data.data));
    }
    catch (err) {
      console.log("Failed to fetch requests");
      console.log(err);
    }
  }


  const reviewStatus = async (status, _id,id2) => {
    try {
      const res = await axios.post(BasicURL + "/request/review/" + status + "/" + _id, {}, { withCredentials: true });
      console.log(res);
      dispatch(removeRequest(id2));
    } catch (err) {
      console.log("Failed to review request");
      console.log(err);
    }
  }

  useEffect(() => {
    fetchRequest();
  }, [])

  if (!requests) return;
  if (requests.length === 0) return (
    <h1 className='text-white text-3xl text-center mt-10'>No request found</h1>
  )
  return (
    <div className="text-center my-10 flex flex-col items-center">
      <h1 className="text-white text-4xl font-semibold mb-6">Connection Request</h1>
      <div className="flex flex-col items-center gap-6 w-full">
        {requests.map((request) => {
          
          const id2=request._id;
          const { _id, firstName, lastName, age, gender, about, photoUrl } = request.fromUserId;
          

          return (
            <div
              key={_id}
              className="w-full md:w-3/4 lg:w-2/3 bg-base-300 rounded-xl p-5 shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-between gap-6 mx-auto"
            >
              {/* Profile Image */}
              <img
                src={photoUrl}
                className="rounded-full w-24 h-24 object-cover border-2 border-gray-400"
                alt={`${firstName} ${lastName}`}
              />

              {/* User Details */}
              <div className="text-left flex-1">
                <h3 className="text-xl font-semibold text-white">
                  {firstName} {lastName}
                </h3>
                {age && gender && <p className="text-gray-400">{age} | {gender}</p>}
                <p className="text-gray-300 text-sm mt-2">{about}</p>
              </div>

              {/* Buttons */}
              <div className="flex items-center">
                <button className="btn btn-error mx-2" onClick={() => { reviewStatus("rejected", _id,id2) }}>Reject</button>
                <button className="btn btn-success mx-2" onClick={() => { reviewStatus("accepted", _id,id2) }}>Accept</button>
              </div>
            </div>
          );

        })}
      </div>
    </div>
  );

}

export default Request
