import React, { createContext, useContext, useEffect, useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home/Home'
import AnimationWrapper from './components/AnimationWrapper'
import Explore from './components/explore'
import VirtualGardern from './components/VirtualGardern'
import Auth from './components/UserAuth'
import { lookInSession } from './components/session'
import BookMark from './components/BookMark'
import AboutUs from './components/aboutus'

export const UserContext = createContext({})

function App({type}) {
  const [userAuth, setUserAuth] = useState({})
  const { userAuths } = useContext(UserContext);
  const userId = userAuths ? userAuths._id : null;


  useEffect (()=>{
    let userInSession = lookInSession("user");
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token: null})
  },[])

  return (
    <UserContext.Provider value={{userAuth,setUserAuth}}>
      <AnimationWrapper keyvalue={type}>
        <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/explore' element={<Explore/>}/>
              <Route path='/virtualgardern' element={<VirtualGardern/>}/>
              <Route path='/bookmark' element={<BookMark/>}/>
              <Route path='/aboutus' element={<AboutUs/>}/>
              <Route path="/signin" element={<Auth type="sign-in"/>}/>
              <Route path="/signup" element={<Auth type="sign-up"/>}/>
        </Routes>
      </AnimationWrapper>
    </UserContext.Provider>
  )
}

export default App
