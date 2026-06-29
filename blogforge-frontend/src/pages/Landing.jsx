import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  // Floating ink-dot particle background
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const dots = Array.from({ length: 38 }, () => ({
      x:   Math.random() * window.innerWidth,
      y:   Math.random() * window.innerHeight,
      r:   Math.random() * 2.5 + 0.5,
      dx:  (Math.random() - 0.5) * 0.35,
      dy:  (Math.random() - 0.5) * 0.35,
      o:   Math.random() * 0.18 + 0.04
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach(d => {
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(233,69,96,${d.o})`
        ctx.fill()
        d.x += d.dx
        d.y += d.dy
        if (d.x < 0 || d.x > canvas.width)  d.dx *= -1
        if (d.y < 0 || d.y > canvas.height) d.dy *= -1
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div style={{
      minHeight:  '100vh',
      background: '#0d0d1a',
      color:      'white',
      fontFamily: "'Inter', sans-serif",
      position:   'relative',
      overflow:   'hidden'
    }}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0, pointerEvents: 'none'
      }} />

      {/* Glow blobs */}
      <div style={{
        position:     'absolute',
        top:          '-120px',
        left:         '-120px',
        width:        '480px',
        height:       '480px',
        borderRadius: '50%',
        background:   'radial-gradient(circle, rgba(233,69,96,0.13) 0%, transparent 70%)',
        pointerEvents:'none'
      }} />
      <div style={{
        position:     'absolute',
        bottom:       '-100px',
        right:        '-80px',
        width:        '400px',
        height:       '400px',
        borderRadius: '50%',
        background:   'radial-gradient(circle, rgba(233,69,96,0.09) 0%, transparent 70%)',
        pointerEvents:'none'
      }} />

      {/* Nav */}
      <nav style={{
        position:       'relative',
        zIndex:         10,
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        padding:        '24px 48px',
        borderBottom:   '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '10px',
          fontSize:   '1.3rem',
          fontWeight: '800',
          letterSpacing: '-0.5px'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🔥</span>
          <span style={{ color: '#e94560' }}>Blog</span>
          <span>Forge</span>
        </div>

        <button
          onClick={() => navigate('/login')}
          style={{
            padding:      '9px 24px',
            borderRadius: '8px',
            border:       '1.5px solid rgba(255,255,255,0.2)',
            background:   'transparent',
            color:        'white',
            fontSize:     '0.9rem',
            fontWeight:   '600',
            cursor:       'pointer',
            transition:   'all 0.2s',
            fontFamily:   'Inter, sans-serif'
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = '#e94560'
            e.target.style.color = '#e94560'
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = 'rgba(255,255,255,0.2)'
            e.target.style.color = 'white'
          }}
        >
          Login
        </button>
      </nav>

      {/* Hero */}
      <div style={{
        position:       'relative',
        zIndex:         10,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        textAlign:      'center',
        padding:        '100px 24px 80px',
        maxWidth:       '780px',
        margin:         '0 auto'
      }}>
        {/* Eyebrow */}
        <div style={{
          display:      'inline-flex',
          alignItems:   'center',
          gap:          '8px',
          padding:      '6px 16px',
          borderRadius: '100px',
          border:       '1px solid rgba(233,69,96,0.35)',
          background:   'rgba(233,69,96,0.08)',
          fontSize:     '0.78rem',
          fontWeight:   '600',
          letterSpacing:'0.08em',
          color:        '#e94560',
          textTransform:'uppercase',
          marginBottom: '32px'
        }}>
          <span style={{
            width: '6px', height: '6px',
            borderRadius: '50%', background: '#e94560',
            display: 'inline-block'
          }} />
          Your blogging partner
        </div>

        {/* Big title */}
        <h1 style={{
          fontSize:      'clamp(3.2rem, 9vw, 6.5rem)',
          fontWeight:    '900',
          lineHeight:    '1.0',
          letterSpacing: '-3px',
          margin:        '0 0 28px',
          color:         'white'
        }}>
          Blog
          <span style={{
            color:              'transparent',
            WebkitTextStroke:   '2px #e94560',
          }}>Forge</span>
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize:     'clamp(1rem, 2.5vw, 1.25rem)',
          color:        'rgba(255,255,255,0.55)',
          lineHeight:   '1.7',
          maxWidth:     '520px',
          margin:       '0 0 48px',
          fontWeight:   '400'
        }}>
          Write your thoughts. Share them with the world.
          <br />
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>
            Let ideas connect people.
          </span>
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding:      '14px 36px',
              borderRadius: '10px',
              border:       'none',
              background:   '#e94560',
              color:        'white',
              fontSize:     '1rem',
              fontWeight:   '700',
              cursor:       'pointer',
              boxShadow:    '0 4px 24px rgba(233,69,96,0.4)',
              transition:   'all 0.2s',
              fontFamily:   'Inter, sans-serif',
              letterSpacing:'-0.2px'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 32px rgba(233,69,96,0.55)'
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 24px rgba(233,69,96,0.4)'
            }}
          >
            Get Started — it's free
          </button>

          <button
            onClick={() => navigate('/login')}
            style={{
              padding:      '14px 36px',
              borderRadius: '10px',
              border:       '1.5px solid rgba(255,255,255,0.15)',
              background:   'rgba(255,255,255,0.05)',
              color:        'rgba(255,255,255,0.8)',
              fontSize:     '1rem',
              fontWeight:   '600',
              cursor:       'pointer',
              transition:   'all 0.2s',
              fontFamily:   'Inter, sans-serif'
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = 'rgba(255,255,255,0.35)'
              e.target.style.color = 'white'
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = 'rgba(255,255,255,0.15)'
              e.target.style.color = 'rgba(255,255,255,0.8)'
            }}
          >
            Login
          </button>
        </div>
      </div>

      {/* 3 value props */}
      <div style={{
        position:       'relative',
        zIndex:         10,
        display:        'flex',
        justifyContent: 'center',
        gap:            '20px',
        padding:        '0 24px 100px',
        flexWrap:       'wrap',
        maxWidth:       '860px',
        margin:         '0 auto'
      }}>
        {[
          { icon: '✍️', title: 'Write freely',    body: 'No distractions. Just you, your ideas, and a clean editor.' },
          { icon: '🌍', title: 'Reach readers',   body: 'Your posts go live instantly. Anyone, anywhere can read them.' },
          { icon: '💡', title: 'Connect by ideas', body: 'Like, comment, and discover writers who think like you.' }
        ].map(card => (
          <div key={card.title} style={{
            flex:         '1 1 220px',
            maxWidth:     '250px',
            padding:      '28px 24px',
            borderRadius: '14px',
            border:       '1px solid rgba(255,255,255,0.07)',
            background:   'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{card.icon}</div>
            <div style={{
              fontWeight:   '700',
              fontSize:     '0.95rem',
              marginBottom: '8px',
              color:        'white'
            }}>{card.title}</div>
            <div style={{
              fontSize:   '0.83rem',
              color:      'rgba(255,255,255,0.4)',
              lineHeight: '1.6'
            }}>{card.body}</div>
          </div>
        ))}
      </div>

      {/* Footer line */}
      <div style={{
        position:   'relative',
        zIndex:     10,
        textAlign:  'center',
        padding:    '0 0 32px',
        fontSize:   '0.78rem',
        color:      'rgba(255,255,255,0.2)'
      }}>
        © 2026 BlogForge · Made with 🔥
      </div>
    </div>
  )
}