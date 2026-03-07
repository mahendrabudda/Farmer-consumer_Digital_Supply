import { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'

const ResetPassword = () => {
  const navigate = useNavigate()
  
  // ── UPDATED CONTEXT DESTRUCTURING ──
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent)
  
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const inputRefs = useRef([])

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  const handleOtpChange = (e, index) => {
    if (e.target.value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').slice(0, 6).split('')
    paste.forEach((char, i) => {
      if (inputRefs.current[i]) inputRefs.current[i].value = char
    })
    inputRefs.current[Math.min(paste.length - 1, 5)]?.focus()
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email', { position: 'top-center', theme: 'dark' })
      return
    }
    const otp = inputRefs.current.map(i => i?.value || '').join('')
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP', { position: 'top-center', theme: 'dark' })
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters', { position: 'top-center', theme: 'dark' })
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', { position: 'top-center', theme: 'dark' })
      return
    }

    setLoading(true)
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email, otp, newPassword
      })

      if (data.success) {
        // ── STEP 1: LOGIN LOCALLY ──
        setIsLoggedin(true)
        
        // ── STEP 2: FETCH PROFILE DATA ──
        await getUserData() 
        
        toast.success('Password reset! Welcome back.', { position: 'top-center', theme: 'dark' })

        // ── STEP 3: ROLE-BASED NAVIGATION ──
        if (data.role === 'farmer') {
          navigate('/farmerdashboard')
        } else {
          navigate('/consumerdashboard')
        }
      } else {
        toast.error(data.message, { position: 'top-center', theme: 'dark' })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong', { position: 'top-center', theme: 'dark' })
    } finally {
      setLoading(false)
    }
  }

  // ... (UI code remains exactly as you provided)
  const inputStyle = {
    width: '100%', padding: '14px 20px', borderRadius: '16px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'white', fontSize: '0.9rem', outline: 'none',
    transition: 'all 0.3s ease', boxSizing: 'border-box'
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#050505', overflow: 'hidden', position: 'relative',
      fontFamily: '"Inter", sans-serif'
    }}>

      {/* ── Grain ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* ── Glows ── */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'rgba(74,222,128,0.07)', borderRadius: '50%', filter: 'blur(120px)', top: '-150px', left: '-150px', opacity: isLoaded ? 1 : 0, transition: 'opacity 1.5s ease' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(34,197,94,0.05)', borderRadius: '50%', filter: 'blur(100px)', bottom: '-150px', right: '-100px', opacity: isLoaded ? 1 : 0, transition: 'opacity 1.5s ease' }} />

      {/* ── Logo ── */}
      <div onClick={() => navigate('/')} style={{
        position: 'absolute', top: '8%', left: '8%', zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'all 1s ease 0.3s'
      }}>
        <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 0 10px rgba(74,222,128,0.4))' }}>🌾</span>
        <span style={{ fontSize: '1rem', fontWeight: 900, color: 'white', letterSpacing: '4px', textTransform: 'uppercase' }}>
          Ma<span style={{ color: '#4ade80' }}>Mholi</span>
        </span>
      </div>

      {/* ── Back to Login ── */}
      <div onClick={() => navigate('/login')} style={{
        position: 'absolute', top: '8%', right: '8%', zIndex: 20,
        cursor: 'pointer', opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease 0.5s'
      }}>
        <span style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>
          ← BACK TO LOGIN
        </span>
      </div>

      {/* ── Card ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: '440px', margin: '0 16px',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.9s cubic-bezier(0.2,0,0.2,1) 0.2s'
      }}>
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(40px)', borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 80px rgba(0,0,0,0.5)'
        }} />

        <div style={{ position: 'relative', padding: '40px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
              fontSize: '1.8rem', marginBottom: '16px'
            }}>🔑</div>
            <h2 style={{ color: 'white', fontSize: '1.9rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              Reset Password
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', marginTop: '8px', fontWeight: 300, lineHeight: 1.6 }}>
              Enter your email, OTP from your inbox,<br />and your new password.
            </p>
          </div>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

  {/* 1. Email */}
  <input type="email" placeholder="Registered Email Address" required
    value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
    onFocus={e => e.target.style.border = '1px solid rgba(74,222,128,0.5)'}
    onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
  />

  {/* 2. New Password */}
  <input type="password" placeholder="New Password" required
    value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle}
    onFocus={e => e.target.style.border = '1px solid rgba(74,222,128,0.5)'}
    onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
  />

  {/* 3. Confirm Password */}
  <input type="password" placeholder="Confirm New Password" required
    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle}
    onFocus={e => e.target.style.border = '1px solid rgba(74,222,128,0.5)'}
    onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
  />

  {/* Match indicator */}
  {confirmPassword && (
    <p style={{ fontSize: '0.75rem', margin: 0, color: newPassword === confirmPassword ? '#4ade80' : '#ef4444' }}>
      {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
    </p>
  )}

  {/* 4. OTP */}
  <div>
    <p style={{ margin: '0 0 10px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
      OTP from Email
    </p>
    <div onPaste={handleOtpPaste} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
      {Array(6).fill(0).map((_, i) => (
        <input key={i} type="text" maxLength="1"
          ref={el => inputRefs.current[i] = el}
          onChange={e => handleOtpChange(e, i)}
          onKeyDown={e => handleOtpKeyDown(e, i)}
          style={{
            width: '46px', height: '54px', textAlign: 'center',
            fontSize: '1.4rem', fontWeight: 700, color: 'white',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px', outline: 'none',
            transition: 'all 0.3s ease', boxSizing: 'border-box'
          }}
          onFocus={e => e.target.style.border = '1px solid rgba(74,222,128,0.5)'}
          onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
        />
      ))}
    </div>
  </div>

  <button type="submit" disabled={loading} style={{
    width: '100%', padding: '15px', marginTop: '4px',
    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
    border: 'none', borderRadius: '16px', color: 'black',
    fontSize: '0.85rem', fontWeight: 900, letterSpacing: '2px',
    textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1, boxShadow: '0 0 30px rgba(74,222,128,0.2)',
    transition: 'all 0.3s ease'
  }}
    onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 40px rgba(74,222,128,0.4)' }}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(74,222,128,0.2)'}
  >
    {loading ? 'Resetting...' : 'Reset Password →'}
  </button>
</form>
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>
            Remember your password?{' '}
            <span onClick={() => navigate('/login')}
              style={{ color: '#4ade80', fontWeight: 700, cursor: 'pointer' }}>
              Sign In
            </span>
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'absolute', bottom: '5%',
        fontSize: '0.6rem', color: 'rgba(255,255,255,0.15)',
        letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700, zIndex: 10
      }}>
        100% Direct · 0% Middlemen
      </div>

    </div>
  )
}

export default ResetPassword