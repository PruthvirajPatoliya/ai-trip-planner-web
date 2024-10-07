import React from 'react'
import { Link } from 'react-router-dom'
import HotelCardItem from './HotelCardItem'

function Hotels({trip}) {
  return (
    <div>
      <h2 className='mt-5 text-xl font-bold'>Hotel Recommendation</h2>

      <div className='grid grid-cols-2 gap-5 my-3 md:grid-cols-3'>

        {trip?.tripData?.hotelOptions?.map((hotel,index)=>(
          <HotelCardItem hotel={hotel}/>
        ))}
      </div>


    </div>
  )
}

export default Hotels