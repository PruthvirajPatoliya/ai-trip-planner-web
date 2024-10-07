import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useNavigation } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';


function Header() {

  const user=JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);
  // const navigation=useNavigation();

  useEffect(()=>{
      console.log(user)
  },[])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })

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
      window.location.reload()
    })
  }

  return (
    <div className='flex items-center justify-between p-3 px-5 shadow-sm'>
      <img src='/IMG_2092.png' className='h-[75px] w-[75px]'/>
      <div>
        {user ?
          <div className='flex items-center gap-3'>
            <a href='/create-trip'>
            <Button variant="outline" className='text-black rounded-full'>+ Make a New Trip</Button>
            </a>
            <a href='/my-trips'>
            <Button variant="outline" className='text-black rounded-full'>My Trips</Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img src={user?.picture} className='h-[35px] w-[35px] rounded-full'/>
                </PopoverTrigger>
              <PopoverContent className='rounded-full'>
                <h2 className='cursor-pointer' onClick={()=>{
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                  // navigation('/')
                }}>Logout</h2>
              </PopoverContent>
            </Popover>

          </div>
          : <Button onClick={()=>setOpenDialog(true)}>Sign In</Button>
        }
        </div>
        <Dialog open={openDialog}>

        <DialogContent>
          <DialogHeader>

            <DialogDescription>
              <img src="/logo.svg" />
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

export default Header