import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom'

function PlaceCardItem({place}) {

  const [photoUrl,setPhotoUrl]=useState();
  useEffect(()=>{
    place&&GetPlacePhoto();
  },[place])
  const GetPlacePhoto=async()=>{
    const data={
      textQuery:place.placeName
    }
    const result=await GetPlaceDetails(data).then(resp=>{

      const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name)
      setPhotoUrl(PhotoUrl);

    })
  }

  return (
    <Link to={'https://www.google.com/maps/search/?api=1&query='+place.placeName} target='_blank'>
        <div className='flex gap-5 p-3 mt-2 transition-all border cursor-pointer rounded-xl hover:scale-105 hover:shadow-md'>
            <img src={photoUrl?photoUrl:'/vertical-logo.png'}
            className='rounded-xl w-[130px] h-[130px] object-cover'/>

            <div>
                <h2 className='text-lg font-bold text-black'>{place.placeName}</h2>
                <p className='text-sm text-gray-500'>{place.placeDetails}</p>
                <h2 className='mt-2 text-sm font-semibold text-black'>🕘 {place.timeTravel}</h2>
                {/* <Button size='sm'><FaMapLocationDot /></Button> */}
            </div>
        </div>
    </Link>
  )
}

export default PlaceCardItem