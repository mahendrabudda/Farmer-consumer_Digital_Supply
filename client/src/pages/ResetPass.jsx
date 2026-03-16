import { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'

const ResetPassword = () => {
  const navigate = useNavigate()
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
    if (e.target.value.length === 1 && index < 5) inputRefs.current[index + 1]?.focus()
  }
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) inputRefs.current[index - 1]?.focus()
  }
  const handleOtpPaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').slice(0, 6).split('')
    paste.forEach((char, i) => { if (inputRefs.current[i]) inputRefs.current[i].value = char })
    inputRefs.current[Math.min(paste.length - 1, 5)]?.focus()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email', { theme: 'light' }); return }
    const otp = inputRefs.current.map(i => i?.value || '').join('')
    if (otp.length !== 6) { toast.error('Please enter the 6-digit OTP', { theme: 'light' }); return }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters', { theme: 'light' }); return }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match', { theme: 'light' }); return }

    setLoading(true)
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword })
      if (data.success) {
        setIsLoggedin(true)
        await getUserData()
        toast.success('Password reset! Welcome back.', { theme: 'light' })
        data.role === 'farmer' ? navigate('/farmerdashboard') : navigate('/consumerdashboard')
      } else {
        toast.error(data.message, { theme: 'light' })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong', { theme: 'light' })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '14px 20px', borderRadius: '14px',
    background: '#f8fafc', border: '1.5px solid #e2e8f0',
    color: '#0f172a', fontSize: '0.9rem', outline: 'none',
    transition: 'all 0.3s ease', boxSizing: 'border-box'
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#ffffff', overflow: 'hidden', position: 'relative',
      fontFamily: '"Inter", sans-serif'
    }}>

      {/* ── Glows ── */}
      <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'rgba(34,197,94,0.06)', borderRadius: '50%', filter: 'blur(120px)', top: '-150px', left: '-150px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(74,222,128,0.05)', borderRadius: '50%', filter: 'blur(100px)', bottom: '-150px', right: '-100px', pointerEvents: 'none' }} />

      {/* ── Logo ── */}
      <div onClick={() => navigate('/')} style={{
        position: 'absolute', top: '8%', left: '8%', zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'all 1s ease 0.3s'
      }}>
        <span style={{ fontSize: '1.8rem' }}>🌾</span>
        <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '4px', textTransform: 'uppercase' }}>
          Ma<span style={{ color: '#22c55e' }}>Mholi</span>
        </span>
      </div>

      {/* ── Back to Login ── */}
      <div onClick={() => navigate('/login')} style={{
        position: 'absolute', top: '8%', right: '8%', zIndex: 20,
        cursor: 'pointer', opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease 0.5s'
      }}>
        <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px' }}>
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
          background: '#ffffff', borderRadius: '28px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          padding: '40px'
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.25)',
              fontSize: '1.8rem', marginBottom: '16px'
            }}>🔑</div>
            <h2 style={{ color: '#0f172a', fontSize: '1.9rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              Reset Password
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '8px', lineHeight: 1.6 }}>
              Enter your email, OTP from your inbox,<br />and your new password.
            </p>
          </div>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* 1. Email */}
            <input type="email" placeholder="Registered Email Address" required
              value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.border = '1.5px solid #22c55e'}
              onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
            />

            {/* 2. New Password */}
            <input type="password" placeholder="New Password" required
              value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.border = '1.5px solid #22c55e'}
              onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
            />

            {/* 3. Confirm Password */}
            <input type="password" placeholder="Confirm New Password" required
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.border = '1.5px solid #22c55e'}
              onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
            />

            {/* Match indicator */}
            {confirmPassword && (
              <p style={{ fontSize: '0.75rem', margin: 0, fontWeight: 600, color: newPassword === confirmPassword ? '#16a34a' : '#ef4444' }}>
                {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}

            {/* 4. OTP */}
            <div>
              <p style={{ margin: '0 0 10px', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
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
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px', marginTop: '4px',
              background: 'linear-gradient(135deg, #4ade80, #22c55e)',
              border: 'none', borderRadius: '14px', color: '#000000',
              fontSize: '0.85rem', fontWeight: 900, letterSpacing: '2px',
              textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 30px rgba(34,197,94,0.4)' }}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.3)'}
            >
              {loading ? 'Resetting...' : 'Reset Password →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem', color: '#94a3b8' }}>
            Remember your password?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#22c55e', fontWeight: 700, cursor: 'pointer' }}>
              Sign In
            </span>
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'absolute', bottom: '5%',
        fontSize: '0.6rem', color: '#cbd5e1',
        letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700, zIndex: 10
      }}>
        100% Direct · 0% Middlemen
      </div>
    </div>
  )
}

export default ResetPassword