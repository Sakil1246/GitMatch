import React, { useState } from 'react'

import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BasicURL } from '../utils/constants';



const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleLogin = async () => {
    try {
      const response = await axios.post(BasicURL + "/login", {
        email,
        password
      }, { withCredentials: true })
      // console.log(response.data);
      dispatch(addUser(response.data));
      return navigate('/');

    } catch (error) {
      setError(error.response.data);
    }
  }

  const handleSignUp = async () => {
    try {
      const response = await axios.post(BasicURL + "/signup", {
        firstName,
        lastName,
        email,
        password
      }, { withCredentials: true })
        console.log(response.data.userSave);
      dispatch(addUser(response.data.userSave));
      return navigate('/profile');

    } catch (error) {
      setError(error.response.data);
    }
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [islogin,setIslogin]=useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (





    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">{islogin? "Login":"Sign Up"}</h2>
          <label className="form-control w-full max-w-xs">




          {!islogin&&<><div className="label">
              <span className="label-text">FIrstName</span>

            </div>
            <input type="text" value={firstName} placeholder="Enter your FirstName" className="input input-bordered w-full max-w-xs" onChange={(e) => { setFirstName(e.target.value) }} />
            <div className="label">
              <span className="label-text">LastName</span>
              
            </div>
            <input type="text" value={lastName} placeholder="Enter your LastName" className="input input-bordered w-full max-w-xs" onChange={(e) => { setLastName(e.target.value) }} />
            </>}
            <div className="label">
              <span className="label-text">Email</span>

            </div>
            <input type="text" value={email} placeholder="Enter your email" className="input input-bordered w-full max-w-xs" onChange={(e) => { setEmail(e.target.value) }} />
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <div className="relative w-full">
  <input
    type={showPassword ? "text" : "password"}  // Toggle between "password" and "text"
    value={password}
    placeholder="Enter your password"
    className="input input-bordered w-full max-w-xs pr-10"
    onChange={(e) => setPassword(e.target.value)}
  />
  <button
    type="button"
    className="absolute inset-y-0 right-2 flex items-center"
    onClick={() => setShowPassword((prev) => !prev)}
  >
    {showPassword ? "👁️" : "🙈"} {/* Toggle between eye and eye-off emoji */}
  </button>
</div>

          </label>
          <p className="text-center text-red-500">{error}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={islogin?handleLogin:handleSignUp}>{islogin?"Login":"Sign Up"}</button>
          </div>
          <p className="text-center text-white cursor-pointer" onClick={()=>setIslogin((value)=>!value)}>{islogin?"New user? Sign up here!":"Existing user? login here!"}</p>
        </div>
      </div>
    </div>
  )
}

export default Login
