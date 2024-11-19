"use client";
import React, { useEffect, useState } from "react";
import './style.css';
import { SubmitUserLogin } from "../../services/services";
import toastr from "toastr";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { get } from "../../utils/apiHelpers";
import { io } from "socket.io-client";

const LoginForm = () => {


  const socket = io("http://localhost:6004/"); // Replace with your server URL


  const initial = {
    email: '',
    password: ''
  };

  const [formData, setFormData] = useState(initial);
  const [errData, setErrData] = useState(initial);
  const router = useRouter(); 

  useEffect(() => {
    let authUser;
    try {
      authUser = JSON.parse(localStorage.getItem("authUser"));
    } catch (error) {
      console.error("Failed to parse authUser from localStorage:", error);
    }
  
    const token = authUser?.token;
  
    if (token) {
      router.push('/'); 
    }
  }, [router]);

  
  //Handle Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrData({
      ...errData,
      [name]: ''
    }); 
  };

  //Handle validate the form
  const validate = () => {
    let errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  //Handle Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrData(errors);
      return;
    }
    try {
      await SubmitUserLogin(formData);
      setFormData(initial);
      // router.push('/'); 
      setTimeout(() => {
        router.push('/');
      }, 100); 
    } catch (error) {
      toastr.error('Login failed. Please try again');
    }
  };



  const handleStartGame = () => {

        // Get the query string from the URL
        const queryParams = new URLSearchParams(window.location.search);
    
        // Extract the 'id' parameter from the query string
        const userId = queryParams.get('id')
  console.log('oooooooooooooooooooooooooooooooo');
  
    if (userId) {
      console.log('oooooooooooooooooooooooooooooooo');

      socket.emit('startGame', userId);
  
      // Listen for game start event
      socket.on(`gameStarted${userId}`, (data) => {
        toastr.success(`Game started with opponent: ${data.opponentId}`);
        // Redirect to game page or show game UI
        // router.push(`/game?opponentId=${data.opponentId}`);
      });
    } else {
      console.log('oooooooooooooooooooooooooooooooo');

      toastr.error('User is not authenticated');
    }
  };


  return (
    <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
      <div className=" bg-white border shadow sm:rounded-lg flex justify-center flex-1 h-screen">
        <div className="lg:w-1/2 xl:w-7/12 p-6 sm:p-12 flex justify-center items-center h-[650px]">
          <div className="flex flex-col justify-center items-center">
            <div className="text-center mt-8" style={{ height: "120px" }}>
              <h1 className="orange-head">start game to Your Account</h1>
            </div>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      className={`w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${errData.email ? 'border-red-500' : ''}`}
                      type="text"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    {errData.email && <p className="text-red-500 text-sm">{errData.email}</p>}
                  </div>
                  <div className="mb-3">
                    <input
                      className={`w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${errData.password ? 'border-red-500' : ''}`}
                      type="password"
                      name="password"
                      value={formData.password || ""}
                      onChange={handleChange}
                      placeholder="Password"
                    />
                    {errData.password && <p className="text-red-500 text-sm">{errData.password}</p>}
                  </div>
                  <button className="orange-btn" type="submit">
                    start game
                  </button>
                </form>
                
              </div>
            </div>
          </div>
          <button className="orange-btn" onClick={handleStartGame}>
  Start Gameeeee
</button>




        </div>


        <div className="flex-1 bg-blue-900 text-center hidden md:flex bgimg">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat">
            <div className="flex flex-col justify-center items-center h-[650px]">
              <h2 className="white-head">Hello Friend!</h2>
              <p className="para mt-4 max-w-[250px]">Enter your personal details and start your journey with us</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
