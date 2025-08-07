import React, { useContext, useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav'
import dp from "../assets/dp.webp"
import { Plus, Camera, Edit3, X, Image, MapPin, Users, Heart, MessageCircle } from "lucide-react";
import { userDataContext } from '../context/userContext';
import EditProfile from '../components/EditProfile';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import Post from '../components/Post';

function Home() {
  let { userData, setUserData, edit, setEdit, postData, setPostData, getPost, handleGetProfile } = useContext(userDataContext)
  let { serverUrl } = useContext(authDataContext)
  let [frontendImage, setFrontendImage] = useState("")
  let [backendImage, setBackendImage] = useState("")
  let [description, setDescription] = useState("")
  let [uploadPost, setUploadPost] = useState(false)
  let image = useRef()
  let [posting, setPosting] = useState(false)
  let [suggestedUser, setSuggestedUser] = useState([])

  function handleImage(e) {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  async function handleUploadPost() {
    setPosting(true)
    try {
      let formdata = new FormData()
      formdata.append("description", description)
      if (backendImage) {
        formdata.append("image", backendImage)
      }
      let result = await axios.post(serverUrl + "/api/post/create", formdata, { withCredentials: true })
      console.log(result)
      setPosting(false)
      setUploadPost(false)
    } catch (error) {
      setPosting(false)
      console.log(error);
    }
  }

  const handleSuggestedUsers = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/suggestedusers", { withCredentials: true })
      console.log(result.data)
      setSuggestedUser(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleSuggestedUsers()
  }, [])

  useEffect(() => {
    getPost()
  }, [uploadPost])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-24 px-4 lg:px-6'>
      {edit && <EditProfile />}
      
      <Nav />

      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 pb-8'>
        
        {/* Left Profile Section */}
        <div className='w-full lg:w-80 lg:sticky lg:top-24 lg:h-fit'>
          <div className='bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all duration-300'>
            {/* Cover Photo */}
            <div 
              className='h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative cursor-pointer overflow-hidden group/cover'
              onClick={() => setEdit(true)}
            >
              {userData.coverImage && (
                <img src={userData.coverImage} alt="Cover" className='w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-500' />
              )}
              <div className='absolute inset-0 bg-black/10 group-hover/cover:bg-black/20 transition-colors duration-300'></div>
              <div className='absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300'>
                <Camera className='w-5 h-5 text-white' />
              </div>
            </div>

            {/* Profile Photo */}
            <div className='relative px-6 pb-6'>
              <div 
                className='w-20 h-20 -mt-10 relative cursor-pointer group/avatar'
                onClick={() => setEdit(true)}
              >
                <div className='w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100'>
                  <img 
                    src={userData.profileImage || dp} 
                    alt="Profile" 
                    className='w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-300' 
                  />
                </div>
                <div className='absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-colors duration-200'>
                  <Plus className='w-4 h-4 text-white' />
                </div>
              </div>

              {/* Profile Info */}
              <div className='mt-4 space-y-2'>
                <h2 className='text-xl font-bold text-slate-800'>
                  {`${userData.firstName} ${userData.lastName}`}
                </h2>
                {userData.headline && (
                  <p className='text-slate-600 font-medium leading-relaxed'>
                    {userData.headline}
                  </p>
                )}
                {userData.location && (
                  <div className='flex items-center gap-1.5 text-slate-500'>
                    <MapPin className='w-4 h-4' />
                    <span className='text-sm'>{userData.location}</span>
                  </div>
                )}
              </div>

              {/* Edit Profile Button */}
              <button 
                className='w-full mt-5 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2'
                onClick={() => setEdit(true)}
              >
                Edit Profile <Edit3 className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Feed Section */}
        <div className='flex-1 max-w-2xl mx-auto lg:mx-0 space-y-6'>
          {/* Create Post Card */}
          <div className='bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-shadow duration-300'>
            <div className='flex items-center gap-4'>
              <div className='w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200'>
                <img src={userData.profileImage || dp} alt="Profile" className='w-full h-full object-cover' />
              </div>
              <button 
                className='flex-1 px-6 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-left text-slate-500 hover:text-slate-700 transition-all duration-200 font-medium'
                onClick={() => setUploadPost(true)}
              >
                Share your thoughts...
              </button>
            </div>
          </div>

          {/* Posts */}
          <div className='space-y-6'>
            {postData.map((post, index) => (
              <Post 
                key={index} 
                id={post._id} 
                description={post.description} 
                author={post.author} 
                image={post.image} 
                like={post.like} 
                comment={post.comment} 
                createdAt={post.createdAt} 
              />
            ))}
          </div>
        </div>

        {/* Right Suggested Users Section */}
        <div className='w-full lg:w-80 lg:sticky lg:top-24 lg:h-fit'>
          <div className='bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-shadow duration-300'>
            <div className='flex items-center gap-2 mb-6'>
              <Users className='w-5 h-5 text-blue-500' />
              <h3 className='text-lg font-bold text-slate-800'>People to Follow</h3>
            </div>
            
            {suggestedUser.length > 0 ? (
              <div className='space-y-4'>
                {suggestedUser.map((su) => (
                  <div 
                    key={su._id}
                    className='flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors duration-200 group'
                    onClick={() => handleGetProfile(su.userName)}
                  >
                    <div className='w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-blue-300 transition-colors duration-200'>
                      <img 
                        src={su.profileImage || dp} 
                        alt="Profile" 
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200' 
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-semibold text-slate-800 truncate'>
                        {`${su.firstName} ${su.lastName}`}
                      </h4>
                      {su.headline && (
                        <p className='text-sm text-slate-500 truncate'>
                          {su.headline}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8 text-slate-500'>
                <Users className='w-12 h-12 mx-auto mb-3 text-slate-300' />
                <p className='font-medium'>No suggestions yet</p>
                <p className='text-sm mt-1'>Check back later for new connections</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Post Modal */}
      {uploadPost && (
        <>
          <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40' onClick={() => setUploadPost(false)}></div>
          
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden'>
              {/* Modal Header */}
              <div className='flex items-center justify-between p-6 border-b border-slate-200'>
                <h2 className='text-xl font-bold text-slate-800'>Create Post</h2>
                <button 
                  className='p-2 hover:bg-slate-100 rounded-full transition-colors duration-200'
                  onClick={() => setUploadPost(false)}
                >
                  <X className='w-5 h-5 text-slate-600' />
                </button>
              </div>

              <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)]'>
                {/* User Info */}
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200'>
                    <img src={userData.profileImage || dp} alt="Profile" className='w-full h-full object-cover' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-slate-800'>
                      {`${userData.firstName} ${userData.lastName}`}
                    </h3>
                    <p className='text-sm text-slate-500'>Sharing publicly</p>
                  </div>
                </div>

                {/* Text Area */}
                <textarea 
                  className='w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 placeholder-slate-400'
                  placeholder="What's on your mind?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* Image Preview */}
                {frontendImage && (
                  <div className='mt-4 rounded-xl overflow-hidden border border-slate-200'>
                    <img src={frontendImage} alt="Preview" className='w-full h-auto max-h-96 object-cover' />
                  </div>
                )}

                <input type="file" ref={image} hidden onChange={handleImage} />

                {/* Actions */}
                <div className='mt-6 flex items-center justify-between'>
                  <button 
                    className='flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors duration-200'
                    onClick={() => image.current.click()}
                  >
                    <Image className='w-5 h-5' />
                    Add Photo
                  </button>

                  <button 
                    className='px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                    disabled={posting}
                    onClick={handleUploadPost}
                  >
                    {posting ? (
                      <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        Posting...
                      </div>
                    ) : (
                      'Post'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Home