import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'

const CheckRegisterMail = () => {
  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContent)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
      if (data.success) {
        toast.success(data.message, { position: 'top-center', theme: 'light' })
        navigate('/reset-password', { state: { email } })
      } else {
        toast.error(data.message, { position: 'top-center', theme: 'light' })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong', { position: 'top-center', theme: 'light' })
    } finally {
      setLoading(false)
    }
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
        width: '100%', maxWidth: '420px', margin: '0 16px',
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
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.25)',
              fontSize: '1.8rem', marginBottom: '16px'
            }}>📧</div>
            <h2 style={{ color: '#0f172a', fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              Forgot Password?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '8px', fontWeight: 400, lineHeight: 1.6 }}>
              Enter your registered email.<br />We'll send you a reset OTP.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input type="email" placeholder="Registered Email Address" required
              value={email} onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '14px 20px', borderRadius: '14px',
                background: '#f8fafc', border: '1.5px solid #e2e8f0',
                color: '#0f172a', fontSize: '0.9rem', outline: 'none',
                transition: 'all 0.3s ease', boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.border = '1.5px solid #22c55e'}
              onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
            />
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
              {loading ? 'Sending...' : 'Send OTP →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.82rem', color: '#94a3b8' }}>
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

export default CheckRegisterMail