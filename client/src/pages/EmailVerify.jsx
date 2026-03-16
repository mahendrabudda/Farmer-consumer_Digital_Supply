import React, { useContext, useEffect, useRef } from 'react'
import { AppContent } from '../Context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {
  axios.defaults.withCredentials = true
  const { backendUrl, getUserData, isLoggedin, userData } = useContext(AppContent)
  const inputRefs = useRef([])
  const navigate = useNavigate()

  const handleChange = (e, index) => {
    if (e.target.value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').slice(0, 6).split('')
    paste.forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    const otp = inputRefs.current.map(input => input?.value || '').join('')
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
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong")
    }
  }

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedin, userData])

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#ffffff', fontFamily: '"Inter", sans-serif',
      position: 'relative', padding: '20px'
    }}>

      {/* ── Glows ── */}
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(34,197,94,0.06)', borderRadius: '50%', filter: 'blur(120px)', top: '-150px', left: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(74,222,128,0.05)', borderRadius: '50%', filter: 'blur(100px)', bottom: '-100px', right: '-80px', pointerEvents: 'none' }} />

      {/* ── Logo ── */}
      <div onClick={() => navigate('/')} style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        cursor: 'pointer', marginBottom: '40px'
      }}>
        <span style={{ fontSize: '2rem' }}>🌾</span>
        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '4px', textTransform: 'uppercase' }}>
          Ma<span style={{ color: '#22c55e' }}>Mholi</span>
        </span>
      </div>

      {/* ── Card ── */}
      <div style={{
        background: '#ffffff', borderRadius: '28px',
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        padding: '40px', width: '100%', maxWidth: '420px',
        textAlign: 'center'
      }}>

        {/* Icon */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '64px', height: '64px', borderRadius: '18px',
          background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.25)',
          fontSize: '1.8rem', marginBottom: '20px'
        }}>📧</div>

        <h1 style={{ color: '#0f172a', fontSize: '1.9rem', fontWeight: 900, margin: '0 0 10px', letterSpacing: '-0.5px' }}>
          Verify Email
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '32px', lineHeight: 1.6 }}>
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={onSubmitHandler}>
          {/* OTP Inputs */}
          <div onPaste={handlePaste} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '28px' }}>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={el => inputRefs.current[index] = el}
                onChange={e => handleChange(e, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                style={{
                  width: '52px', height: '56px', textAlign: 'center',
                  fontSize: '1.4rem', fontWeight: 700, color: '#0f172a',
                  background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  borderRadius: '14px', outline: 'none',
                  transition: 'all 0.3s ease', boxSizing: 'border-box'
                }}
                onFocus={e => e.target.style.border = '1.5px solid #22c55e'}
                onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
              />
            ))}
          </div>

          <button type="submit" style={{
            width: '100%', padding: '15px',
            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
            border: 'none', borderRadius: '14px',
            color: '#000000', fontSize: '0.85rem', fontWeight: 900,
            letterSpacing: '2px', textTransform: 'uppercase',
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
            transition: 'all 0.3s ease'
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 30px rgba(34,197,94,0.4)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.3)'}
          >
            Verify Email →
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '0.82rem', color: '#94a3b8' }}>
          Back to{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#22c55e', fontWeight: 700, cursor: 'pointer' }}>
            Login
          </span>
        </p>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'absolute', bottom: '4%',
        fontSize: '0.6rem', color: '#cbd5e1',
        letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700
      }}>
        100% Direct · 0% Middlemen
      </div>
    </div>
  )
}

export default EmailVerify