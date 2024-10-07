"use client"
import React, { useEffect, useState } from 'react';
import './style.css'
import Link from 'next/link';
import WishList from '../Modal/WishList';
import { getToken } from '@/utils/commonFunctions';
import { ListUserWishListCount } from '@/services/services';
import { useRouter } from 'next/navigation';

const Navbar = ({search , setSearch ,submit ,setSubmit}) => {
  const [token,setToken] = useState('')
  const [isOpen, setIsOpen] = useState(false);
  const [wishListCount,setWishListCount] = useState(0)
  const router = useRouter()

  useEffect(()=>{
    const token = getToken()
    setToken(token)
  },[token])

  useEffect(() => {
    if (token) {
      fetchCount();
    }
  }, [token, submit]); 

  // Handle fetch count
  const fetchCount = async()=>{    
    try {
      if(token){        
        const count = await ListUserWishListCount()
        setWishListCount(count)
      }
    } catch (error) {
      
    }
  }


  const openModal = () => {
    if(!token){
      router.push('/login')
      return
    }
    setIsOpen(true);
};

  return (
    <nav className="bg-[#003F62]">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          <div className="flex flex-1 items-center justify-center ">
            <div className="inpt-btn-container">
              <input className='inpt' 
              onChange={(e)=>setSearch(e.target.value)}
              value={search}
              name='search' 
              type="text" placeholder="Search..." />
              <button 
              onClick={() => setSubmit((prev) => !prev)} 
              className='btn'>Search</button>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button
                onClick={openModal}
                type="button"
                className="relative rounded-full  p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">View notifications</span>
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.4094 20.81C13.0694 20.93 12.5094 20.93 12.1694 20.81C9.26943 19.82 2.78943 15.69 2.78943 8.69C2.78943 5.6 5.27943 3.1 8.34943 3.1C10.1694 3.1 11.7794 3.98 12.7894 5.34C13.7994 3.98 15.4194 3.1 17.2294 3.1C20.2994 3.1 22.7894 5.6 22.7894 8.69C22.7894 15.69 16.3094 19.82 13.4094 20.81Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </button>
            <div className="relative ml-3 roundes p-1">
              {wishListCount || 0}
            </div>
            <div className="relative ml-3 text-white ">
              {!token ?
              <Link href={`/login`}>Sign In</Link>
              :
              <Link href={`/logout`}>Sign Out</Link>
             }
            </div>
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.99995 2H3.73996C4.81996 2 5.66996 2.93 5.57996 4L4.74995 13.96C4.60995 15.59 5.89995 16.99 7.53995 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.5399 6.88C21.6599 5.22 20.3999 3.87 18.7299 3.87H5.81996" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16.25 22C16.9403 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9403 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.24995 22C8.94031 22 9.49995 21.4404 9.49995 20.75C9.49995 20.0596 8.94031 19.5 8.24995 19.5C7.5596 19.5 6.99995 20.0596 6.99995 20.75C6.99995 21.4404 7.5596 22 8.24995 22Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.99995 8H21" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>                </button>
              </div>

            </div>
            <div className="relative ml-3 roundes p-1">
              0
            </div>
            <div className="relative ml-3 text-white ">
              <span>Cart</span>
            </div>
          </div>
        </div>
      </div>
      {isOpen &&
      <WishList isOpen={isOpen} setIsOpen={setIsOpen} submit={submit} setSubmit={setSubmit}/>
      }
      </nav>
  );
};

export default Navbar;
