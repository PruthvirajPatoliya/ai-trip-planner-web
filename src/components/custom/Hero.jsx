import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className='flex flex-col items-center mx-56 gap-9'>
      <h1
      className='font-extrabold text-[45px] text-center mt-16'
      >
        <span className='text-[#f56551]'>Discover Your Next Adventure With AI:</span> Personalized Itineraries at Your Fingertips</h1>
      <p className='text-xl text-center text-gray-500'>
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interest and budget.
      </p>
                
      

      <img src='/landing.png' className='mb-5 h-500'/>
      <Link to={'/create-trip'}>
        <Button className='mb-10'> Get Started, It's Free</Button>
      </Link>
    </div>
  )
}

export default Hero

 