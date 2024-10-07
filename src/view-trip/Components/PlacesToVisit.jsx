import React from 'react'
import PlaceCardItem from './PlaceCardItem'


function PlacesToVisit({trip}) {
  return (
    <div>
        <h2 className='mt-5 text-xl font-bold'>Places To Visit</h2>
           
        <div>
           {trip.tripData?.itinerary.map((item,index)=>(
              <div className='mt-5'>
                <h2 className='text-lg font-semibold'>Day {item.day}</h2>
                <div className='grid gap-5 md:grid-cols-2'>
                  {item.plan.map((place,index)=>(
                    <div className='my-3'>
                      <h2 className='text-sm font-semibold text-orange-600'>{place.time}</h2>
                      <PlaceCardItem place={place}/>
                    </div>
                  ))}
                </div>

              </div>
           ))}
        </div>
    </div>
  )
}

export default PlacesToVisit