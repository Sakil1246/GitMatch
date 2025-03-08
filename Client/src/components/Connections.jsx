import React, { useEffect } from 'react'
import { BasicURL } from '../utils/constants';
import axios from 'axios';
import { addConnection } from '../utils/connectionSlice';
import { useDispatch, useSelector } from 'react-redux';

const Connections = () => {

  const connections = useSelector((store) => store.connections);
  // console.log(connections);
  const dispatch = useDispatch();
  const fetchusers = async () => {
    try {
      const res = await axios.get(BasicURL + "/user/connections", { withCredentials: true });
      dispatch(addConnection(res.data.data));

    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    fetchusers();
  }, []);
  if (!connections) return;
  if (connections.length === 0) return (
    <h1 className='text-white mt-12 text-3xl text-center'>No connections found</h1>

  );
  return (
    <div className="text-center my-10 flex flex-col items-center">
      <h1 className="text-white text-4xl font-semibold mb-6">Connections</h1>
      <div className="flex flex-col items-center gap-6 w-full">
        {connections.map(({ _id, firstName, lastName, age, gender, about, photoUrl }) => (
          <div key={_id} className="w-full md:w-1/2 lg:w-1/3 bg-base-300 rounded-xl p-5 shadow-lg hover:shadow-xl transition duration-300 flex items-center gap-4 mx-auto">
            {/* Profile Image */}
            <div>
              <img
                src={photoUrl}
                className="rounded-full w-24 h-24 object-cover border-2 border-gray-400"
                alt={`${firstName} ${lastName}`}
              />
            </div>
  
            {/* User Details */}
            <div className="text-left">
              <h3 className="text-xl font-semibold text-white">{firstName} {lastName}</h3>
              {age && gender && <p className="text-gray-400">{age} | {gender}</p>}
              <p className="text-gray-300 text-sm mt-2">{about}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  
};

export default Connections
