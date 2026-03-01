import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Intro = () => {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.onended = () => handleExit()
      video.ontimeupdate = () => {
        if (video.duration) {
          setProgress((video.currentTime / video.duration) * 100)
        }
      }
    }
    // Trigger entry animations
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleExit = () => {
    setFadeOut(true)
    setTimeout(() => navigate('/register'), 800)
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100vw', height: '100vh',
      overflow: 'hidden', background: '#050505',
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      fontFamily: '"Inter", sans-serif'
    }}>
      
      {/* ── Cinematic Grain Overlay (Subtle Texture) ── */}
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: 5, pointerEvents: 'none',
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />

      {/* ── Main Video Container ── */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${isLoaded ? 1 : 1.1})`,
        width: '85vw', height: '85vh',
        transition: 'transform 2s cubic-bezier(0.2, 0, 0.2, 1)',
        zIndex: 1
      }}>
        <video
          ref={videoRef}
          autoPlay muted playsInline
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', borderRadius: '32px',
            boxShadow: '0 0 100px rgba(0,0,0,0.9)'
          }}
        >
          <source src='/mahe_1.mp4' type='video/mp4' />
        </video>

        {/* ── Dynamic Gradient & Glow ── */}
        <div style={{
          position: 'absolute', inset: -2,
          borderRadius: '34px',
          background: 'linear-gradient(45deg, rgba(74,222,128,0.2), transparent 40%, rgba(34,197,94,0.1))',
          zIndex: -1,
          filter: 'blur(10px)'
        }} />
        
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '32px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)',
          zIndex: 2, pointerEvents: 'none'
        }} />
      </div>

      {/* ── Top Navigation / Logo ── */}
      <div style={{
        position: 'absolute', top: '7%', width: '100%',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 10, opacity: isLoaded ? 1 : 0,
        transform: `translateY(${isLoaded ? 0 : '-20px'})`,
        transition: 'all 1s ease 0.5s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            fontSize: '2.2rem', 
            filter: 'drop-shadow(0 0 15px rgba(74,222,128,0.4))'
          }}>🌾</div>
          <span style={{
            fontSize: '1.2rem', fontWeight: 900, color: 'white',
            letterSpacing: '4px', textTransform: 'uppercase'
          }}>
            Ma<span style={{ color: '#4ade80' }}>Mholi</span>
          </span>
        </div>
      </div>

      {/* ── Floating Skip Button ── */}
      <button
        onClick={handleExit}
        style={{
          position: 'absolute', top: '7%', right: '7.5%',
          zIndex: 10, padding: '10px 24px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '100px', color: 'white',
          fontSize: '0.75rem', fontWeight: 600,
          cursor: 'pointer', backdropFilter: 'blur(12px)',
          letterSpacing: '1px', opacity: isLoaded ? 0.8 : 0,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
          e.currentTarget.style.transform = 'translateX(5px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
          e.currentTarget.style.transform = 'translateX(0)'
        }}
      >
        REGISTER →
      </button>

      {/* ── Center Content ── */}
      <div style={{
        position: 'absolute', bottom: '18%', left: '50%',
        transform: `translateX(-50%) translateY(${isLoaded ? 0 : '40px'})`,
        opacity: isLoaded ? 1 : 0,
        transition: 'all 1.2s cubic-bezier(0.2, 0, 0.2, 1) 0.8s',
        zIndex: 10, textAlign: 'center', width: '100%'
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 4.5rem)', fontWeight: 900,
          color: 'white', marginBottom: '1rem', letterSpacing: '-1px'
        }}>
          From <span style={{
            background: 'linear-gradient(120deg, #4ade80, #22c55e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(74,222,128,0.3))'
          }}>Soil</span> to <span style={{
            background: 'linear-gradient(120deg, #4ade80, #22c55e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Soul</span>
        </h1>
        <p style={{
          fontSize: '1rem', color: 'rgba(255,255,255,0.6)',
          maxWidth: '500px', margin: '0 auto', lineHeight: 1.6,
          fontWeight: 300, letterSpacing: '0.5px'
        }}>
          Experience the revolution of direct farming. <br/>
          Empowering growers, nourishing lives.
        </p>
      </div>

      {/* ── Progress & Stats Footer ── */}
      <div style={{
        position: 'absolute', bottom: '6%', left: '0', width: '100%',
        zIndex: 10, display: 'flex', flexDirection: 'column', 
        alignItems: 'center', gap: '2rem',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 1s ease 1.2s'
      }}>
        
        {/* Sleek Progress Bar */}
        <div style={{
          width: '200px', height: '2px', 
          background: 'rgba(255,255,255,0.1)', borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: '#4ade80', transition: 'width 0.2s linear',
            boxShadow: '0 0 10px #4ade80'
          }} />
        </div>

        {/* Minimalist Stats */}
        <div style={{ display: 'flex', gap: '4rem' }}>
          {[
            { v: '10K+', l: 'FARMERS' },
            { v: '50K+', l: 'CONSUMERS' },
            { v: '0%', l: 'MIDDLEMEN' }
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>{s.v}</div>
              <div style={{ color: '#4ade80', fontSize: '0.6rem', fontWeight: 900, letterSpacing: '2px', marginTop: '4px' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Intro