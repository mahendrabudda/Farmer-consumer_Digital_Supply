import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../Context/AppContext.jsx'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const { setIsLoggedin, setUserData } = useContext(AppContent)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)

      // ── MOCK CREDENTIALS ──
      if (email === 'mahendra@gmail.com' && password === '123456') {
        const mockUser = { email, name: 'Mahendra', role: 'farmer' }
        setIsLoggedin(true)
        setUserData(mockUser)
        toast.success('Welcome, Mahendra!')
        navigate('/farmerDashboard')

      } else if (email === 'mahe@gmail.com' && password === '654321') {
        const mockUser = { email, name: 'Mahe', role: 'consumer' }
        setIsLoggedin(true)
        setUserData(mockUser)
        toast.success('Welcome, Mahe!')
        navigate('/consumerDashboard')

      } else {
        // This triggers the popup message you requested
        toast.error('User details not found. Please check your email or password.', {
          position: "top-center",
      
          theme: "dark",
        })
      }
      // ── END MOCK ──
    }, 1000)
  }
  const inputStyle = {
    width: '100%', padding: '14px 20px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white', fontSize: '0.9rem',
    outline: 'none', transition: 'all 0.3s ease',
    boxSizing: 'border-box'
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
      <div
        onClick={() => navigate('/')}
        style={{
          position: 'absolute', top: '8%', left: '8%', zIndex: 20,
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

      {/* ── Register Link ── */}
      <div style={{
        position: 'absolute', top: '8%', right: '8%', zIndex: 20,
        opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease 0.5s'
      }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>No account? </span>
        <span
          onClick={() => navigate('/register')}
          style={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '1px' }}
        >
          REGISTER →
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
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(40px)', borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 80px rgba(0,0,0,0.5)'
        }} />

        <div style={{ position: 'relative', padding: '40px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
              fontSize: '1.8rem', marginBottom: '16px'
            }}>👋</div>
            <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              Welcome Back
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '8px', fontWeight: 300 }}>
              Access your farm-fresh dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="email" placeholder="Email Address" required
              value={email} onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.border = '1px solid rgba(74,222,128,0.5)'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
            />
            <input
              type="password" placeholder="Password" required
              value={password} onChange={e => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.border = '1px solid rgba(74,222,128,0.5)'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
            />

            <p
              onClick={() => navigate('/reset-password')}
              style={{ textAlign: 'right', fontSize: '0.75rem', color: 'rgba(74,222,128,0.6)', cursor: 'pointer', margin: 0 }}
            >
              Forgot Password?
            </p>

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
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)' }}>
            New to the market?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{ color: '#4ade80', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.5px' }}
            >
              Join Now
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

export default Login