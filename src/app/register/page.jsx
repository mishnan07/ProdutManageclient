"use client"
import React, { useState } from "react";
import './style.css';
import { SubmitUserRegister } from "../../services/services";
import toastr from "toastr";
import Link from "next/link";

const RegistrationForm = () => {
  const initial = {
    name: '',
    email: '',
    password: ''
  };
  const [formData, setFormData] = useState(initial);
  const [errData, setErrData] = useState(initial);
  

  // Handle input change
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

  // Validate form fields
  const validate = () => {
    let errors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
    }
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

  // Handle Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrData(errors);
      return;
    }
    try {
      await SubmitUserRegister(formData);
      setFormData(initial);
    } catch (error) {
      toastr.error('Registration failed');
    }
  };

  return (
    <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
      <div className=" bg-white border shadow sm:rounded-lg flex justify-center flex-1 h-screen">
        <div className="flex-1 bg-blue-900 text-center hidden md:flex bgimg">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
          >
            <div className="flex flex-col justify-center items-center h-[650px]">
              <h2 className="white-head">Welcome Back!</h2>
              <p className="para mt-4 max-w-[250px]">
                To keep connected with us please login with your personal info
              </p>
              <Link href="/login">
                    <button className="sgn-btn">SIGN IN</button>
                    </Link>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 xl:w-7/12 p-6 sm:p-12 flex justify-center items-center h-screen ">
          <div className="flex flex-col justify-center items-center">
            <div className="text-center mt-8">
              <h1 className="orange-head">Create Account</h1>
            </div>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      className={`w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white ${errData.name ? 'border-red-500' : ''}`}
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      placeholder="Name"
                    />
                    {errData.name && <p className="text-red-500 text-sm">{errData.name}</p>}
                  </div>

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
                    Sign UP
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
