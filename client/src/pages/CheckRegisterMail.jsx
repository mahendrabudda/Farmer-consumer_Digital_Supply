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
        toast.success(data.message, { position: 'top-center', theme: 'dark' })
        // pass email to next page via state
        navigate('/reset-password', { state: { email } })
      } else {
        toast.error(data.message, { position: 'top-center', theme: 'dark' })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong', { position: 'top-center', theme: 'dark' })
    } finally {
      setLoading(false)
    }
  }

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
        width: '100%', maxWidth: '420px', margin: '0 16px',
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
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
              fontSize: '1.8rem', marginBottom: '16px'
            }}>📧</div>
            <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              Forgot Password?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '8px', fontWeight: 300, lineHeight: 1.6 }}>
              Enter your registered email.<br />We'll send you a reset OTP.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input type="email" placeholder="Registered Email Address" required
              value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.border = '1px solid rgba(74,222,128,0.5)'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
            />

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
              {loading ? 'Checking...' : 'Send OTP →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)' }}>
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

export default CheckRegisterMail