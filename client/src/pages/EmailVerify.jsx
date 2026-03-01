import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets.js'
import { AppContent } from '../Context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {

  axios.defaults.withCredentials = true;

  const { backendUrl, getUserData , isLoggedin , userData} = useContext(AppContent)
  const inputRefs = useRef([])
  const navigate = useNavigate()

  const handleChange = (e, index) => {
    const value = e.target.value
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, 6)
    const pasteArray = paste.split('')

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }


  const onSubmitHandler = async (e) => {
    e.preventDefault()

    const otp = inputRefs.current
  .map(input => input?.value || '')
  .join('')

    if (otp.length !== 6) {
      toast.error("Please enter all 6 digits")
      return
    }

    try {
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })

      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong"
)
    }
  }

  useEffect(()=>{

    isLoggedin && userData && userData.isAccountverified && navigate('/')
  },[isLoggedin , userData])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>

      <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='w-28 sm:w-32 mb-8 drop-shadow-2xl' />

      <form onSubmit={onSubmitHandler}
        className='bg-white shadow-2xl rounded-2xl p-8 w-full max-w-sm 
                   flex flex-col items-center text-center space-y-6'
      >
        <h1 className='text-3xl font-extrabold text-gray-900'>Email Verify OTP</h1>

        <p className='text-gray-600 text-sm'>Enter the 6-digit code sent to your Email</p>

        <div onPaste={handlePaste} className='flex justify-between w-full mb-8 space-x-2'>
          {
            Array(6).fill(0).map((_, index) => {
              return (
                <input
                  type="text"
                  maxLength='1'
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className='w-12 h-12 sm:w-10 sm:h-10 text-gray-900 text-center text-2xl font-semibold 
                             border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400
                             shadow-sm transition-all'
                />
              )
            })
          }
        </div>

        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 
          to-indigo-900 text-white rounded-full'>
          Verify Email
        </button>

      </form>

    </div>
  )
}

export default EmailVerify
