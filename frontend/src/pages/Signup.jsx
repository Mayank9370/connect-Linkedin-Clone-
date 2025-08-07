import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/userContext'
import { Eye, EyeOff, Mail, Lock, User, UserPlus, ArrowRight, Sparkles, Users } from 'lucide-react'

function Signup() {
  let [show, setShow] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  let { userData, setUserData } = useContext(userDataContext)
  let navigate = useNavigate()
  let [firstName, setFirstName] = useState("")
  let [lastName, setLastName] = useState("")
  let [userName, setUserName] = useState("")
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")
  let [loading, setLoading] = useState(false)
  let [err, setErr] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl + "/api/auth/signup", {
        firstName,
        lastName,
        userName,
        email,
        password
      }, { withCredentials: true })
      console.log(result)
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setUserName("")
    } catch (error) {
      setErr(error.response.data.message)
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col'>
      {/* Header */}
      <div className='w-full px-6 lg:px-8 py-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='hidden sm:flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-blue-500' />
            <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
              Connect
            </span>
          </div>
        </div>
        <button 
          className='text-slate-600 hover:text-blue-600 font-medium transition-colors duration-200'
          onClick={() => navigate("/login")}
        >
          Already have an account?
        </button>
      </div>

      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-4 py-8'>
        <div className='w-full max-w-md'>
          {/* Welcome Card */}
          <div className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8'>
            <div className='text-center mb-8'>
              <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                <Users className='w-8 h-8 text-white' />
              </div>
              <h1 className='text-3xl font-bold text-slate-800 mb-2'>Join Our Community</h1>
              <p className='text-slate-600'>Create your account and start connecting</p>
            </div>

            <form onSubmit={handleSignUp} className='space-y-5'>
              {/* Name Fields */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                    <User className='w-4 h-4' />
                    First Name
                  </label>
                  <input 
                    type="text" 
                    placeholder='John'
                    required 
                    className='w-full h-12 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 px-4 py-3 rounded-xl outline-none transition-all duration-200 placeholder-slate-400'
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-slate-700'>
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    placeholder='Doe'
                    required 
                    className='w-full h-12 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 px-4 py-3 rounded-xl outline-none transition-all duration-200 placeholder-slate-400'
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                  />
                </div>
              </div>

              {/* Username Field */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                  <UserPlus className='w-4 h-4' />
                  Username
                </label>
                <input 
                  type="text" 
                  placeholder='johndoe123'
                  required 
                  className='w-full h-12 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 px-4 py-3 rounded-xl outline-none transition-all duration-200 placeholder-slate-400'
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                />
              </div>

              {/* Email Field */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                  <Mail className='w-4 h-4' />
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder='john@example.com'
                  required 
                  className='w-full h-12 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 px-4 py-3 rounded-xl outline-none transition-all duration-200 placeholder-slate-400'
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              {/* Password Field */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                  <Lock className='w-4 h-4' />
                  Password
                </label>
                <div className='relative'>
                  <input 
                    type={show ? "text" : "password"} 
                    placeholder='Create a strong password'
                    required 
                    className='w-full h-12 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 px-4 py-3 pr-14 rounded-xl outline-none transition-all duration-200 placeholder-slate-400'
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <button
                    type="button"
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors duration-200'
                    onClick={() => setShow(prev => !prev)}
                  >
                    {show ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {err && (
                <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
                  <p className='text-red-600 text-sm font-medium text-center'>
                    {err}
                  </p>
                </div>
              )}

              {/* Sign Up Button */}
              <button 
                type="submit"
                className='w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                disabled={loading}
              >
                {loading ? (
                  <div className='flex items-center gap-3'>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    Creating Account...
                  </div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className='w-5 h-5' />
                  </>
                )}
              </button>

              {/* Sign In Link */}
              <div className='text-center pt-4'>
                <p className='text-slate-600'>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className='text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-200'
                    onClick={() => navigate("/login")}
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className='text-center text-slate-500 text-sm'>
            <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup