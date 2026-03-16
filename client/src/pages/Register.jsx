import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext.jsx'
import { toast } from 'react-toastify'
import axios from 'axios'

const Register = () => {
  const navigate = useNavigate()
  const { setIsLoggedin, setUserData, backendUrl, getUserData } = useContext(AppContent)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!role) {
      toast.error('Please select your role — Farmer or Consumer')
      return
    }
    setLoading(true)
    axios.defaults.withCredentials = true
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/register', {
        fullName: name, email, password, phoneNumber: phone, address: location, role
      })
      if (data.success) {
        setIsLoggedin(true)
        await getUserData()
        toast.success('Account created! Welcome to MaMholi.')
        navigate(role === 'farmer' ? '/farmerdashboard' : '/consumerdashboard')
      } else {
        toast.error(data.message || 'Registration failed')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message, { position: 'top-center', theme: 'light' })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '13px 20px', borderRadius: '14px',
    background: '#f8fafc', border: '1.5px solid #e2e8f0',
    color: '#0f172a', fontSize: '0.85rem', outline: 'none',
    transition: 'all 0.3s ease', boxSizing: 'border-box',
    fontFamily: '"Inter", sans-serif'
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#ffffff', overflow: 'hidden', position: 'relative',
      fontFamily: '"Inter", sans-serif', padding: '40px 16px'
    }}>

      {/* ── Glows ── */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', background: 'rgba(34,197,94,0.06)', borderRadius: '50%', filter: 'blur(120px)', top: '-150px', right: '-150px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: '400px', height: '400px', background: 'rgba(74,222,128,0.05)', borderRadius: '50%', filter: 'blur(100px)', bottom: '-150px', left: '-100px', pointerEvents: 'none' }} />

      {/* ── Logo ── */}
      <div onClick={() => navigate('/')} style={{
        position: 'fixed', top: '5%', left: '6%', zIndex: 20,
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

      {/* ── Login link ── */}
      <div style={{
        position: 'fixed', top: '5%', right: '6%', zIndex: 20,
        opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease 0.5s'
      }}>
        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Have an account? </span>
        <span onClick={() => navigate('/login')}
          style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '1px' }}>
          LOGIN →
        </span>
      </div>

      {/* ── Card ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: '500px',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.9s cubic-bezier(0.2,0,0.2,1) 0.2s',
        marginTop: '60px'
      }}>
        <div style={{
          background: '#ffffff', borderRadius: '28px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          padding: '40px'
        }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'rgba(34,197,94,0.1)', border: '1.5px solid rgba(34,197,94,0.25)',
              fontSize: '1.8rem', marginBottom: '14px'
            }}>🌱</div>
            <h2 style={{ color: '#0f172a', fontSize: '1.9rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              Join MaMholi
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: '8px', fontWeight: 400 }}>
              Connect directly with the soil.
            </p>
          </div>

          {/* ── Role Selection ── */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{
              fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase',
              marginBottom: '12px', textAlign: 'center'
            }}>
              I am a...
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

              {/* Farmer Card */}
              <button type="button" onClick={() => setRole('farmer')} style={{
                padding: '20px 16px', borderRadius: '18px', cursor: 'pointer',
                background: role === 'farmer' ? 'rgba(34,197,94,0.06)' : '#f8fafc',
                border: role === 'farmer' ? '2px solid #22c55e' : '2px solid #e2e8f0',
                boxShadow: role === 'farmer' ? '0 0 20px rgba(34,197,94,0.15)' : 'none',
                transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px'
              }}>
                <span style={{ fontSize: '2.2rem' }}>🌾</span>
                <div>
                  <div style={{ color: role === 'farmer' ? '#16a34a' : '#475569', fontSize: '0.88rem', fontWeight: 800, letterSpacing: '1px' }}>Farmer</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.68rem', marginTop: '4px', lineHeight: 1.4 }}>Sell your produce directly</div>
                </div>
                {role === 'farmer' && (
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', color: 'black', fontWeight: 900
                  }}>✓</div>
                )}
              </button>

              {/* Consumer Card */}
              <button type="button" onClick={() => setRole('consumer')} style={{
                padding: '20px 16px', borderRadius: '18px', cursor: 'pointer',
                background: role === 'consumer' ? 'rgba(34,197,94,0.06)' : '#f8fafc',
                border: role === 'consumer' ? '2px solid #22c55e' : '2px solid #e2e8f0',
                boxShadow: role === 'consumer' ? '0 0 20px rgba(34,197,94,0.15)' : 'none',
                transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px'
              }}>
                <span style={{ fontSize: '2.2rem' }}>🛒</span>
                <div>
                  <div style={{ color: role === 'consumer' ? '#16a34a' : '#475569', fontSize: '0.88rem', fontWeight: 800, letterSpacing: '1px' }}>Consumer</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.68rem', marginTop: '4px', lineHeight: 1.4 }}>Buy fresh from farms</div>
                </div>
                {role === 'consumer' && (
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', color: 'black', fontWeight: 900
                  }}>✓</div>
                )}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input type="text" placeholder="Full Name" required
                value={name} onChange={e => setName(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.border = '1.5px solid #22c55e'}
                onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
              />
              <input type="tel" placeholder="Phone Number" required
                value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.border = '1.5px solid #22c55e'}
                onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
              />
            </div>
            <input type="email" placeholder="Email Address" required
              value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.border = '1.5px solid #22c55e'}
              onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
            />
            <input type="password" placeholder="Password" required
              value={password} onChange={e => setPassword(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.border = '1.5px solid #22c55e'}
              onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
            />
            <input type="text" placeholder="Location / Address" required
              value={location} onChange={e => setLocation(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.border = '1.5px solid #22c55e'}
              onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
            />
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px',
              background: 'linear-gradient(135deg, #4ade80, #22c55e)',
              border: 'none', borderRadius: '14px',
              color: '#000000', fontSize: '0.85rem', fontWeight: 900,
              letterSpacing: '2px', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
              transition: 'all 0.3s ease', marginTop: '8px'
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 30px rgba(34,197,94,0.4)' }}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.3)'}
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.82rem', color: '#94a3b8' }}>
            Already a member?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#22c55e', fontWeight: 700, cursor: 'pointer' }}>
              Sign In
            </span>
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'fixed', bottom: '3%',
        fontSize: '0.6rem', color: '#cbd5e1',
        letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700, zIndex: 10
      }}>
        100% Direct · 0% Middlemen
      </div>
    </div>
  )
}

export default Register