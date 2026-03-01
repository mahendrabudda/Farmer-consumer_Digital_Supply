import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext.jsx'
import { toast } from 'react-toastify'

const CROP_OPTIONS = [
  'Rice', 'Wheat', 'Corn', 'Sugarcane', 'Cotton',
  'Tomato', 'Onion', 'Potato', 'Chilli', 'Mango',
  'Banana', 'Groundnut', 'Soybean', 'Sunflower', 'Other'
]

const Register = () => {
  const navigate = useNavigate()
  const { setIsLoggedin, setUserData } = useContext(AppContent)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('consumer')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [selectedCrops, setSelectedCrops] = useState([])

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  const toggleCrop = (crop) => {
    setSelectedCrops(prev =>
      prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop]
    )
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (role === 'farmer' && selectedCrops.length === 0) {
      toast.error('Please select at least one crop')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const mockUser = { name, email, phone, location, role, crops: selectedCrops }
      setIsLoggedin(true)
      setUserData(mockUser)
      toast.success('Account created successfully!')
      navigate(role === 'farmer' ? '/farmerdashboard' : '/consumerdashboard')
    }, 1000)
  }

  const inputStyle = {
    width: '100%', padding: '13px 20px',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white', fontSize: '0.85rem',
    outline: 'none', transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#050505', overflow: 'hidden', position: 'relative',
      fontFamily: '"Inter", sans-serif', padding: '40px 16px'
    }}>

      {/* ── Grain ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* ── Glows ── */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', background: 'rgba(74,222,128,0.07)', borderRadius: '50%', filter: 'blur(120px)', top: '-150px', right: '-150px', opacity: isLoaded ? 1 : 0, transition: 'opacity 1.5s ease' }} />
      <div style={{ position: 'fixed', width: '400px', height: '400px', background: 'rgba(34,197,94,0.05)', borderRadius: '50%', filter: 'blur(100px)', bottom: '-150px', left: '-100px', opacity: isLoaded ? 1 : 0, transition: 'opacity 1.5s ease' }} />

      {/* ── Logo ── */}
      <div
        onClick={() => navigate('/')}
        style={{
          position: 'fixed', top: '5%', left: '6%', zIndex: 20,
          display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateX(0)' : 'translateX(-20px)',
          transition: 'all 1s ease 0.3s'
        }}
      >
        <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 0 10px rgba(74,222,128,0.4))' }}>🌾</span>
        <span style={{ fontSize: '1rem', fontWeight: 900, color: 'white', letterSpacing: '4px', textTransform: 'uppercase' }}>
          Ma<span style={{ color: '#4ade80' }}>Mholi</span>
        </span>
      </div>

      {/* ── Login link ── */}
      <div style={{
        position: 'fixed', top: '5%', right: '6%', zIndex: 20,
        opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease 0.5s'
      }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Have an account? </span>
        <span
          onClick={() => navigate('/login')}
          style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '1px' }}
        >
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
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(40px)', borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 80px rgba(0,0,0,0.5)'
        }} />

        <div style={{ position: 'relative', padding: '40px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
              fontSize: '1.8rem', marginBottom: '14px'
            }}>🌱</div>
            <h2 style={{ color: 'white', fontSize: '1.9rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              Join MaMholi
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: '8px', fontWeight: 300 }}>
              Connect directly with the soil.
            </p>
          </div>

          {/* Role Toggle */}
          <div style={{
            display: 'flex', borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px'
          }}>
            {['consumer', 'farmer'].map(r => (
              <button
                key={r} type="button" onClick={() => setRole(r)}
                style={{
                  flex: 1, padding: '12px',
                  background: role === r ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'transparent',
                  border: 'none', color: role === r ? 'black' : 'rgba(255,255,255,0.4)',
                  fontSize: '0.78rem', fontWeight: 900, letterSpacing: '2px',
                  textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: role === r ? '0 0 20px rgba(74,222,128,0.2)' : 'none'
                }}
              >
                {r === 'consumer' ? '🛒 Consumer' : '🌾 Farmer'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input type="text" placeholder="Full Name" required
                value={name} onChange={e => setName(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.border = '1px solid rgba(74,222,128,0.5)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
              />
              <input type="tel" placeholder="Phone Number" required
                value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.border = '1px solid rgba(74,222,128,0.5)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
              />
            </div>

            <input type="email" placeholder="Email Address" required
              value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.border = '1px solid rgba(74,222,128,0.5)'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
            />

            <input type="password" placeholder="Password" required
              value={password} onChange={e => setPassword(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.border = '1px solid rgba(74,222,128,0.5)'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
            />

            <input type="text" placeholder="Location / Address" required
              value={location} onChange={e => setLocation(e.target.value)} style={inputStyle}
              onFocus={e => e.target.style.border = '1px solid rgba(74,222,128,0.5)'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
            />

            {/* Crops */}
            {role === 'farmer' && (
              <div>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Select Your Crops
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {CROP_OPTIONS.map(crop => (
                    <button
                      key={crop} type="button" onClick={() => toggleCrop(crop)}
                      style={{
                        padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        background: selectedCrops.includes(crop) ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.04)',
                        border: selectedCrops.includes(crop) ? '1px solid rgba(74,222,128,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        color: selectedCrops.includes(crop) ? '#4ade80' : 'rgba(255,255,255,0.4)',
                        boxShadow: selectedCrops.includes(crop) ? '0 0 10px rgba(74,222,128,0.15)' : 'none'
                      }}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '15px',
                background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                border: 'none', borderRadius: '16px',
                color: 'black', fontSize: '0.85rem', fontWeight: 900,
                letterSpacing: '2px', textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                boxShadow: '0 0 30px rgba(74,222,128,0.2)',
                transition: 'all 0.3s ease', marginTop: '8px'
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 40px rgba(74,222,128,0.4)' }}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(74,222,128,0.2)'}
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>

          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)' }}>
            Already a member?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ color: '#4ade80', fontWeight: 700, cursor: 'pointer' }}
            >
              Sign In
            </span>
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        position: 'fixed', bottom: '3%',
        fontSize: '0.6rem', color: 'rgba(255,255,255,0.12)',
        letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700, zIndex: 10
      }}>
        100% Direct · 0% Middlemen
      </div>

    </div>
  )
}

export default Register