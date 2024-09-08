import { Leaf, Sprout, BookOpen, Microscope } from "lucide-react";
import React, { useContext} from 'react'
import { UserContext } from "../App";
import { removeFromSession } from "./session";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  let {userAuth: {access_token}, setUserAuth} = useContext(UserContext)
  const Signoutuser = () =>{
    removeFromSession("user")
    setUserAuth({access_token:null})
  }
  const navigate = useNavigate();


  return (
    <>
    {
      access_token ? 
      <header className="w-full px-4 lg:px-6 h-14 flex items-center bg-white shadow-sm">
          <a className="flex items-center justify-center" href="/">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">Virtual Herbal Garden</span>
          </a>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <a className="text-sm font-medium text-gray-900 hover:underline underline-offset-4" href="/">
              Home
            </a>
            <a className="text-sm font-medium text-gray-900 hover:underline underline-offset-4" href="/aboutus">
              About
            </a>
            <a className="text-sm font-medium text-gray-900 hover:underline underline-offset-4" href="/explore">
              Explore
            </a>
            <a className="text-sm font-medium text-gray-900 hover:underline underline-offset-4" href="/">
              Contact
            </a>
            <a className="text-sm font-medium text-gray-900 hover:underline underline-offset-4" href="/bookmark ">
              Bookmark
            </a>
            <a className="text-sm font-medium text-gray-900 hover:underline underline-offset-4" href="/virtualgardern">
              Virtual Tour
            </a>
            {
              access_token? 
              <Link onClick={Signoutuser} className="text-sm font-medium text-gray-900 hover:underline underline-offset-4" href="/signup">
              signout
              </Link>
              :
              <a className="text-sm font-medium text-gray-900 hover:underline underline-offset-4" href="/signup">
                Login
              </a>
            }
          </nav>
      </header>
      :
      navigate('/signin')
    } 
    </>
  )
}

export default Navbar
