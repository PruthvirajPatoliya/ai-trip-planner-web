import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {

  const navigation=useNavigation();
  const [userTrips,setUserTrips]=useState([]);

  useEffect(()=>{
    GetUserTrips();
  },[])

  // Used to get User trips details
    const GetUserTrips=async()=>{
        const user=JSON.parse(localStorage.getItem('user'));
        
        if(!user)
        {
            navigation('/');
            return;
        }

        
        const q=query(collection(db, 'AITrips'),where('userEmail','==',user?.email));
        const querySnapshot = await getDocs(q);
        setUserTrips([]);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          setUserTrips(prevVal=>[...prevVal, doc.data()])
        });
    }

    return (
    <div className='px-5 mt-10 sm:px-10 md:px-32 lg:px-56 xl:px-10'>
      <h2 className='text-3xl font-bold'>My Trips</h2>

      <div className='grid grid-cols-2 gap-5 md:grid-cols-3'>
        {userTrips?.length>0?userTrips.map((trip,index)=>(
          <UserTripCardItem trip={trip} key={index} />
        ))
        :[1,2,3,4,5,6].map((item,index)=>(
          <div key={index} className='h-[220px] w-full mt-3 bg-slate-600 animate-pulse rounded-xl'>
          </div>
        ))
      }
      </div>
    </div>
    )
}

export default MyTrips
