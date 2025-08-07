import React, { useContext, useEffect, useState } from 'react'
import logo2 from "../assets/logo2.png"
import dp from "../assets/dp.webp"
import { userDataContext } from '../context/userContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import { Search, Home, Users, Bell, LogOut, User, Sparkles } from 'lucide-react';

function Nav() {
  let [activeSearch, setActiveSearch] = useState(false)
  let { userData, setUserData, handleGetProfile } = useContext(userDataContext)
  let [showPopup, setShowPopup] = useState(false)
  let navigate = useNavigate()
  let { serverUrl } = useContext(authDataContext)
  let [searchInput, setSearchInput] = useState("")
  let [searchData, setSearchData] = useState([])

  const handleSignOut = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      setUserData(null)
      navigate("/login")
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`, { withCredentials: true })
      setSearchData(result.data)
    } catch (error) {
      setSearchData([])
      console.log(error)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [searchInput])

  return (
    <div className='w-full h-20 bg-white/95 backdrop-blur-md fixed top-0 shadow-lg border-b border-slate-200/50 flex justify-between md:justify-around items-center px-4 lg:px-6 left-0 z-[80]'>
      {/* Left Section - Logo & Search */}
      <div className='flex justify-center items-center gap-4'>
        <div 
          onClick={() => {
            setActiveSearch(false)
            navigate("/")
          }}
          className='flex items-center gap-2 cursor-pointer group'
        >
          <div className='hidden sm:flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-blue-500' />
            <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
              Connect
            </span>
          </div>
        </div>

        {!activeSearch && (
          <button 
            className='p-2 hover:bg-slate-100 rounded-full transition-colors duration-200 lg:hidden'
            onClick={() => setActiveSearch(true)}
          >
            <Search className='w-6 h-6 text-slate-600' />
          </button>
        )}

        {/* Search Results Dropdown */}
        {searchData.length > 0 && (
          <div className='absolute top-20 left-0 lg:left-5 w-full lg:w-[700px] max-h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50'>
            <div className='p-4 border-b border-slate-200'>
              <h3 className='text-lg font-semibold text-slate-800 flex items-center gap-2'>
                <Search className='w-5 h-5' />
                Search Results
              </h3>
            </div>
            <div className='max-h-96 overflow-y-auto'>
              {searchData.map((sea) => (
                <div 
                  key={sea._id}
                  className='flex gap-4 items-center p-4 hover:bg-slate-50 cursor-pointer transition-colors duration-200 border-b border-slate-100 last:border-b-0 group'
                  onClick={() => handleGetProfile(sea.userName)}
                >
                  <div className='w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-blue-300 transition-colors duration-200'>
                    <img src={sea.profileImage || dp} alt="Profile" className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-200'>
                      {`${sea.firstName} ${sea.lastName}`}
                    </h4>
                    {sea.headline && (
                      <p className='text-sm text-slate-600 mt-1'>{sea.headline}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Form */}
        <form className={`w-48 lg:w-80 h-12 bg-slate-100 lg:flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200 focus-within:border-blue-500 focus-within:bg-white transition-all duration-200 ${!activeSearch ? "hidden" : "flex"}`}>
          <Search className='w-5 h-5 text-slate-500' />
          <input 
            type="text" 
            className='flex-1 bg-transparent outline-none border-0 text-slate-700 placeholder-slate-500' 
            placeholder='Search users...' 
            onChange={(e) => setSearchInput(e.target.value)} 
            value={searchInput} 
          />
        </form>
      </div>

      {/* Right Section - Navigation & Profile */}
      <div className='flex justify-center items-center gap-2 lg:gap-6'>
        {/* Profile Popup */}
        {showPopup && (
          <>
            <div 
              className='fixed inset-0 bg-black/20 backdrop-blur-sm z-40' 
              onClick={() => setShowPopup(false)}
            ></div>
            
            <div className='w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 absolute top-20 right-4 lg:right-20 z-50 overflow-hidden'>
              {/* Profile Header */}
              <div className='p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200'>
                <div className='flex items-center gap-4'>
                  <div className='w-16 h-16 rounded-full overflow-hidden border-3 border-white shadow-lg'>
                    <img src={userData.profileImage || dp} alt="Profile" className='w-full h-full object-cover' />
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-slate-800'>
                      {`${userData.firstName} ${userData.lastName}`}
                    </h3>
                    <p className='text-sm text-slate-600'>@{userData.userName}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className='p-4 space-y-2'>
                <button 
                  className='w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 rounded-xl transition-colors duration-200 text-slate-700 hover:text-blue-600'
                  onClick={() => handleGetProfile(userData.userName)}
                >
                  <User className='w-5 h-5' />
                  <span className='font-medium'>View Profile</span>
                </button>

                <button 
                  className='w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 rounded-xl transition-colors duration-200 text-slate-700 hover:text-blue-600'
                  onClick={() => navigate("/network")}
                >
                  <Users className='w-5 h-5' />
                  <span className='font-medium'>My Networks</span>
                </button>

                <div className='h-px bg-slate-200 my-2'></div>

                <button 
                  className='w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 rounded-xl transition-colors duration-200 text-red-600 hover:text-red-700'
                  onClick={handleSignOut}
                >
                  <LogOut className='w-5 h-5' />
                  <span className='font-medium'>Sign Out</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Navigation Items */}
        <button 
          className='hidden lg:flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-100 transition-colors duration-200 text-slate-600 hover:text-blue-600 group'
          onClick={() => navigate("/")}
        >
          <Home className='w-6 h-6 mb-1 group-hover:scale-110 transition-transform duration-200' />
          <span className='text-xs font-medium'>Home</span>
        </button>

        <button 
          className='hidden md:flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-100 transition-colors duration-200 text-slate-600 hover:text-blue-600 group'
          onClick={() => navigate("/network")}
        >
          <Users className='w-6 h-6 mb-1 group-hover:scale-110 transition-transform duration-200' />
          <span className='text-xs font-medium'>Networks</span>
        </button>

        <button 
          className='flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-100 transition-colors duration-200 text-slate-600 hover:text-blue-600 group relative'
          onClick={() => navigate("/notification")}
        >
          <Bell className='w-6 h-6 mb-1 group-hover:scale-110 transition-transform duration-200' />
          <span className='hidden md:block text-xs font-medium'>Notifications</span>
          {/* Notification Badge */}
          <div className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white'></div>
        </button>

        {/* Profile Avatar */}
        <button 
          className='w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 hover:border-blue-400 transition-all duration-200 hover:shadow-lg'
          onClick={() => setShowPopup(prev => !prev)}
        >
          <img src={userData.profileImage || dp} alt="Profile" className='w-full h-full object-cover hover:scale-105 transition-transform duration-200' />
        </button>
      </div>
    </div>
  )
}

export default Nav