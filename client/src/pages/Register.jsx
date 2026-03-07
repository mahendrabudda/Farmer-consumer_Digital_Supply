import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext.jsx'
import { toast } from 'react-toastify'
import axios from 'axios' // 1. Import Axios

const Register = () => {
  const navigate = useNavigate()
  // 2. Extract necessary functions and variables from Context
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

  // 3. Refactored onSubmit for real API calls
  const onSubmit = async (e) => {
    e.preventDefault()
    
    if (!role) {
      toast.error('Please select your role — Farmer or Consumer')
      return
    }

    setLoading(true)
    
    // Ensure axios sends cookies so the JWT is stored immediately
    axios.defaults.withCredentials = true;

    try {
      // 4. Match keys with your backend controller: 
      // { fullName, email, password, phoneNumber, address, role }
      const { data } = await axios.post(backendUrl + '/api/auth/register', {
        fullName: name,
        email,
        password,
        phoneNumber: phone,
        address: location,
        role: role
      });

      if (data.success) {
        setIsLoggedin(true);
        // 5. Fetch fresh user data into global state
        await getUserData();
        
        toast.success('Account created! Welcome to MaMholi.');
        
        // 6. Navigate based on the selected role
        navigate(role === 'farmer' ? '/farmerdashboard' : '/consumerdashboard');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      // 7. Dynamic error handling for network or server issues
      toast.error(error.response?.data?.message || error.message, {
        position: 'top-center',
        theme: 'dark'
      });
    } finally {
      setLoading(false);
    }
  }

  // --- UI STYLING REMAINS UNCHANGED ---
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

          {/* ── Role Selection Cards ── */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{
              fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)',
              fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center'
            }}>
              I am a...
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

              {/* Farmer Card */}
              <button type="button" onClick={() => setRole('farmer')} style={{
                padding: '20px 16px', borderRadius: '18px', cursor: 'pointer',
                background: role === 'farmer' ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.02)',
                border: role === 'farmer' ? '1.5px solid rgba(74,222,128,0.5)' : '1.5px solid rgba(255,255,255,0.07)',
                boxShadow: role === 'farmer' ? '0 0 24px rgba(74,222,128,0.12)' : 'none',
                transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px'
              }}>
                <span style={{ fontSize: '2.2rem' }}>🌾</span>
                <div>
                  <div style={{
                    color: role === 'farmer' ? '#4ade80' : 'rgba(255,255,255,0.7)',
                    fontSize: '0.88rem', fontWeight: 800, letterSpacing: '1px'
                  }}>Farmer</div>
                  <div style={{
                    color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem',
                    marginTop: '4px', lineHeight: 1.4
                  }}>Sell your produce directly</div>
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
                background: role === 'consumer' ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.02)',
                border: role === 'consumer' ? '1.5px solid rgba(74,222,128,0.5)' : '1.5px solid rgba(255,255,255,0.07)',
                boxShadow: role === 'consumer' ? '0 0 24px rgba(74,222,128,0.12)' : 'none',
                transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px'
              }}>
                <span style={{ fontSize: '2.2rem' }}>🛒</span>
                <div>
                  <div style={{
                    color: role === 'consumer' ? '#4ade80' : 'rgba(255,255,255,0.7)',
                    fontSize: '0.88rem', fontWeight: 800, letterSpacing: '1px'
                  }}>Consumer</div>
                  <div style={{
                    color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem',
                    marginTop: '4px', lineHeight: 1.4
                  }}>Buy fresh from farms</div>
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

export default Register;