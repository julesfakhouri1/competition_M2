'use client'

import { useEffect, useState } from 'react'

export default function PortraitGuard() {
  const [isLandscape, setIsLandscape] = useState(false)
  const [dismissed,   setDismissed]   = useState(false)

  useEffect(() => {
    const check = () => {
      const landscape = window.innerWidth > window.innerHeight
      setIsLandscape(landscape)
      if (!landscape) setDismissed(false)
    }
    check()
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])

  if (!isLandscape || dismissed) return null

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="pg-title"
      aria-describedby="pg-desc"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'rgba(8,14,32,0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        width: '280px',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.06)',
      }}>
        {/* Icône */}
        <div style={{ padding: '24px 20px 0', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px', height: '48px',
            borderRadius: '14px',
            background: 'rgba(0,200,255,0.12)',
            border: '1px solid rgba(0,200,255,0.25)',
            marginBottom: '14px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="rgba(0,200,255,0.9)" strokeWidth="1.7"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <rect x="5" y="2" width="14" height="20" rx="2"/>
              <circle cx="12" cy="18" r="1" fill="rgba(0,200,255,0.9)" stroke="none"/>
            </svg>
          </div>

          <p id="pg-title" style={{
            fontSize: '16px', fontWeight: 700,
            color: '#ffffff', marginBottom: '8px',
          }}>
            Mode portrait requis
          </p>
          <p id="pg-desc" style={{
            fontSize: '13px', color: 'rgba(188,205,232,0.55)',
            lineHeight: 1.55, marginBottom: '20px',
          }}>
            Veuillez tourner votre téléphone en mode portrait pour utiliser cette application.
          </p>
        </div>

        {/* Séparateur */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

        {/* Bouton */}
        <button
          onClick={() => setDismissed(true)}
          style={{
            width: '100%',
            padding: '15px',
            background: 'transparent',
            border: 'none',
            color: '#00C8FF',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
            letterSpacing: '0.01em',
          }}
        >
          OK
        </button>
      </div>
    </div>
  )
}
