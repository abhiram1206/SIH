import React from 'react'
import Navbar from './Navbar'

const VirtualGardern = () => {
  return (
  <div className="w-[1500px]">
    <Navbar/>
    <iframe src="https://app.lapentor.com/sphere/final-vg" className='w-screen h-screen' frameborder="0"  scrolling="no" allow="vr,gyroscope,accelerometer" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" oallowfullscreen="true" msallowfullscreen="true"></iframe>
  </div>
  )
}

export default VirtualGardern
