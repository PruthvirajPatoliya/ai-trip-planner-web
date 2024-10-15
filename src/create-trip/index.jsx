import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelsList } from '@/constants/options';
import { chatSession } from '@/service/AIModal';
import React, { useEffect, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { toast, Toaster } from 'sonner';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"

import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, documentId, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';


function CreateTrip() {
  const [place, setPlace] = useState();

  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (name, value) => {

    setFormData({
      ...formData,
      [name]: value
    })
  }

  useEffect(() => {
    console.log(formData);
  }, [formData])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })

  const OnGenerateTrip = async () => {

    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDialog(true)
      return;
    }

    if (formData?.noOfDays > 8 && !formData?.location || !formData?.budget || !formData?.traveler) {

      toast("Please fill all the details.")
      return;
    }

    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT

      .replace('{location}', formData?.location?.label)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget)
      .replace('{totalDays}', formData?.noOfDays)

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log("--", result?.response?.text());

    setLoading(false);
    SaveAiTrip(result?.response?.text())
    
  }

  // const SaveAiTrip =async(TripData) => {

  //   setLoading(true);
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   const docId = Date.now().toString()
  //   // Add a new document in collection
  //   await setDoc(doc(db, "AITrips", docId), {
  //     userSelection: formData,
      
  //     tripData: JSON.parse(TripData),
  //     userEmail: user?.email,
  //     id: docId
  //   });
  //   setLoading(false);
  //   navigate('/view-trip/' + docId)
  // }
  const SaveAiTrip = async (TripData) => {
    setLoading(true);

    try {
        // Parse user data from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.email) {
            throw new Error("User not found or email is missing.");
        }

        // Generate a unique document ID
        const docId = Date.now().toString();

        // Validate formData
        if (!formData) {
            throw new Error("User selection data (formData) is missing.");
        }

        // Log TripData for debugging
        console.log("TripData received:", TripData);

        // Attempt to parse TripData
        let parsedTripData;
        try {
            // Check if TripData is a string
            if (typeof TripData !== 'string') {
                throw new Error("Trip data must be a string.");
            }
            parsedTripData = JSON.parse(TripData);
        } catch (error) {
            throw new Error("Trip data is not valid JSON: " + error.message);
        }

        // Add a new document to the Firestore collection
        await setDoc(doc(db, "AITrips", docId), {
            userSelection: formData,
            tripData: parsedTripData,
            userEmail: user.email,
            id: docId
        });

        // Navigate to the new trip view after successful save
        navigate('/view-trip/' + docId);
    } catch (error) {
        console.error("Error saving trip data:", error.message);
        // Optionally, display an error message to the user
        alert(`Failed to save trip: ${error.message}`);
    } finally {
        setLoading(false); // Ensure loading state is reset
    }
};



  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      OnGenerateTrip();
    })
  }
  return (
    <div className='px-5 mt-10 sm:px-10 md:px-32 lg:px-56 xl:px-10'>

      <h2 className='text-3xl font-bold'>Tell us your travel preferences 🏕️🌴</h2>
      <p className='mt-3 text-xl text-gray-500'>Just provide some basic information, and our trip planner will generate an itinerary based on your preferences.</p>

      <div className='flex flex-col gap-10 mt-20'>
        <div>
          <h2 className='my-3 text-xl font-medium'>What is destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => { setPlace(v); handleInputChange('location', v) }

            }}
          />
        </div>
        <div>
          <h2 className='my-3 text-xl font-medium'>How many days are you planning your trip?</h2>
          <Input placeholder={'Ex.3'} type='number' min='0'
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>
      </div>
      <div>
        <h2 className='my-3 text-xl font-medium'>What is your budget?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div key={index}

              onClick={() => handleInputChange('budget', item.title)}

              className={`p-4 border rounded-lg cursor-pointer
             hover:shadow-lg
             ${formData?.budget == item.title && 'shadow-lg border-black'}
             `}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='text-lg font-bold'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className='my-3 text-xl font-medium'>Who do you plan on travelling with on your next adventure?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectTravelsList.map((item, index) => (
            <div key={index}

              onClick={() => handleInputChange('traveler', item.people)}

              className={`p-4 border rounded-lg cursor-pointer 
              hover:shadow-lg
              ${formData?.traveler == item.people && 'shadow-lg border-black'}
              `}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='text-lg font-bold'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-end my-10'>
        <Button
          disabled={loading}
          onClick={OnGenerateTrip}>
          {loading ?
            <AiOutlineLoading3Quarters className='w-7 h-7 animate-spin' /> : 'Generate Trip'
          }
          
        </Button>
        
      </div>

      <Dialog open={openDialog}>

        <DialogContent>
          <DialogHeader>

            <DialogDescription>
              <img src="/IMG_2092.png" />
              <h2 className='text-lg font-bold mt-7'>Sign In With Google</h2>
              <p>Sign In to the App with Google Authentication Securely</p>

              <Button

                onClick={login}
                className="flex items-center w-full gap-4 mt-5">

                <FcGoogle className='h-7 w-7' />
                Sign In With Google
              </Button>

            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>


    </div>
  )
}

export default CreateTrip

