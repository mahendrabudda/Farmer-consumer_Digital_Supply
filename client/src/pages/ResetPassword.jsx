import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState(1) // 1 = send otp, 2 = reset password

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // STEP 1: Send Reset OTP
  const sendResetOtp = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/send-reset-otp',
        { email }
      )

      if (data.success) {
        toast.success(data.message)
        setStep(2)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // STEP 2: Reset Password
  const resetPassword = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/reset-password',
        { email, otp, newPassword }
      )

      if (data.success) {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4'>
      <img src={assets.logo} alt="" className='w-28 sm:w-32 mb-8 drop-shadow-2xl' />

      <form
        onSubmit={step === 1 ? sendResetOtp : resetPassword}
        className='bg-white shadow-2xl rounded-2xl p-8 w-full max-w-sm 
                   flex flex-col items-center text-center space-y-6'
      >
        <h1 className='text-3xl font-extrabold text-gray-900'>
          Reset Password
        </h1>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='w-full px-4 py-2 border rounded-lg outline-none'
        />

        {/* OTP & NEW PASSWORD (only after OTP sent) */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className='w-full px-4 py-2 border rounded-lg outline-none'
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className='w-full px-4 py-2 border rounded-lg outline-none'
            />
          </>
        )}

        <button
          type="submit"
          className='w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition'
        >
          {step === 1 ? 'Send OTP' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
