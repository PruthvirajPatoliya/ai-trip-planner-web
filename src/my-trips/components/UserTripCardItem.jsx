import React, { useEffect, useState } from 'react'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import { Link } from 'react-router-dom';

function UserTripCardItem({trip}) {

    const [photoUrl,setPhotoUrl]=useState();
    useEffect(()=>{
    trip&&GetPlacePhoto();
    },[trip])
    const GetPlacePhoto=async()=>{
        const data={
        textQuery:trip?.userSelection?.location?.label
        }
        const result=await GetPlaceDetails(data).then(resp=>{
        console.log(resp.data.places[0].photos[3].name);

        const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name)
        setPhotoUrl(PhotoUrl);

        })
    }
  return (
    <Link to={'/view-trip/'+trip?.id}>
    <div className='transition-all hover:scale-105 '>
        <img src={photoUrl?photoUrl:'/vertical-logo.png'} className="object-cover mt-3 rounded-xl h-[220px] w-full "/>
        <div>
            <h2 className='mt-1 text-lg font-bold text-black'>{trip?.userSelection?.location?.label}</h2>
            <h2 className='mb-5 text-sm text-gray-500'>{trip?.userSelection.noOfDays} Days Trip with {trip?.userSelection.budget} Budget</h2>
        </div>
    </div>
    </Link>
  )
}

export default UserTripCardItem