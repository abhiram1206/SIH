// src/pages/Auth.js

import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios'; // Import axios for making HTTP requests
import { storeInSession } from './session';
import { UserContext } from '../App';

const Auth = ({ type }) => {
  const navigate = useNavigate();
  const authform = useRef();
  let {userAuth: {access_token}, setUserAuth} = useContext(UserContext)

  const userAuthTroughServer = (serverRoute, formData) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        sessionStorage.setItem("user", JSON.stringify(data)); // Update to sessionStorage or localStorage as needed
        setUserAuth(data);
        navigate('/'); // Redirect to a dashboard or another page after successful auth
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let serverRoute = type === "sign-in" ? "/signin" : "/signup";
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    let form = new FormData(authform.current);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { username, fullname, email, password } = formData;

    if (!emailRegex.test(email)) {
      return toast.error("Email is Invalid");
    }
    if (!passwordRegex.test(password)) {
      return toast.error("Password should be 6 to 20 characters long with a numeric, 1 uppercase and 1 lowercase letters");
    }
    userAuthTroughServer(serverRoute, formData);
  };

  const navToSignup = () => navigate('/signup');
  const navToSignin = () => navigate('/signin');

  return (
    <div className="flex justify-center w-[1530px] items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {type === 'sign-up' ? 'Sign Up' : 'Login'}
        </h2>
        <form ref={authform} onSubmit={handleSubmit}>
          {type === 'sign-up' && (
            <>
              <div className="mb-4">
                <label htmlFor="fullname" className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name='fullname'
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  name='username'
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name='email'
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name='password'
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            {type === 'sign-up' ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          {type === 'sign-up' ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={type === 'sign-up' ? navToSignin : navToSignup}
            className="text-blue-500 hover:underline"
          >
            {type === 'sign-up' ? 'Login' : 'Sign Up'}
          </button>
        </p>
        <Toaster />
      </div>
    </div>
  );
};

export default Auth;
