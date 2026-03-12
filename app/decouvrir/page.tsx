'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Outfit, Rajdhani } from 'next/font/google'
import { type Locale, getLocaleFromCookie } from '@/lib/i18n'

const outfit   = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['600', '700'] })

export default function DecouvrirPage() {
  const router = useRouter()
  const [locale, setLocale] = useState<Locale>('fr')

  useEffect(() => { setLocale(getLocaleFromCookie()) }, [])

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.045)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '20px',
    padding: '18px',
  }

  return (
    <main
      className={outfit.className}
      style={{
        minHeight: '100dvh',
        display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(180deg, #0D1B35 0%, #1B1042 52%, #0E0820 100%)',
        paddingTop:    'max(2.5rem, env(safe-area-inset-top,    0px))',
        paddingBottom: 'max(2rem,   env(safe-area-inset-bottom, 0px))',
        paddingLeft:   'max(1.25rem, env(safe-area-inset-left,  0px))',
        paddingRight:  'max(1.25rem, env(safe-area-inset-right, 0px))',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', flexShrink: 0 }}>
        <button
          onClick={() => router.back()}
          aria-label="Retour"
          style={{
            flexShrink: 0,
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <h1 style={{
          fontFamily: rajdhani.style.fontFamily,
          fontSize: '20px', fontWeight: 700,
          color: '#ffffff', margin: 0, lineHeight: 1,
        }}>
          À découvrir avec Enchanted Tools
        </h1>
      </div>

      {/* Bento grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Card événements */}
        <div style={card}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(188,205,232,0.6)', margin: '0 0 14px' }}>
            Nos prochains événements
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4361EE', flexShrink: 0, marginTop: '5px' }} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: '0 0 2px', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  Demo IA &amp; Robotique
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(188,205,232,0.55)', margin: 0 }}>
                  15 mars 2026 · En ligne
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', flexShrink: 0, marginTop: '5px' }} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: '0 0 2px', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  Atelier Robotique Enfants
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(188,205,232,0.55)', margin: 0 }}>
                  22 mars 2026 · Paris
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Row : réseaux + métiers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

          {/* Réseaux sociaux */}
          <div style={card}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(188,205,232,0.6)', margin: '0 0 14px' }}>
              Nos réseaux sociaux
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* YouTube */}
              <a href="https://www.youtube.com/@enchantedtools" target="_blank" rel="noopener noreferrer"
                style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="12" viewBox="0 0 24 17" fill="white">
                  <path d="M23.5 2.5S23.2.7 22.4 0C21.4-1 20.3-1 19.8-1 16.5-1.3 12-1.3 12-1.3s-4.5 0-7.8.3C3.7-.7 2.6-.7 1.6 0 .8.7.5 2.5.5 2.5S.2 4.6.2 6.7v2c0 2.1.3 4.2.3 4.2s.3 1.8 1.1 2.5c1 .9 2.3.9 2.9 1 2.1.2 9 .3 9 .3s4.5 0 7.8-.4c.5-.1 1.6-.1 2.6-.9.8-.7 1.1-2.5 1.1-2.5s.3-2.1.3-4.2v-2C23.8 4.6 23.5 2.5 23.5 2.5zM9.7 11.5V5l6.5 3.3-6.5 3.2z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/enchanted.tools/" target="_blank" rel="noopener noreferrer"
                style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@enchanted.tools" target="_blank" rel="noopener noreferrer"
                style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#010101', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="16" viewBox="0 0 24 27" fill="white">
                  <path d="M19.6 5.4A5.6 5.6 0 0 1 14 0h-4v18.5a2.5 2.5 0 1 1-2.5-2.5c.2 0 .5 0 .7.1V12a7 7 0 1 0 5.8 6.9V9.1a9.6 9.6 0 0 0 5.6 1.8V7a5.7 5.7 0 0 1-.9-.1 5.6 5.6 0 0 1-1.1-.5v-1z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/enchantedtools/" target="_blank" rel="noopener noreferrer"
                style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0077B5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Métiers */}
          <div style={{ ...card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', margin: '0 0 6px' }}>
                Métiers de la robotique
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(188,205,232,0.55)', margin: 0, lineHeight: 1.4 }}>
                Explorez les carrières de demain.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.open('https://enchanted-tools.com/careers', '_blank')}
              style={{
                alignSelf: 'flex-start',
                padding: '6px 14px',
                borderRadius: '999px',
                background: '#4361EE',
                border: 'none', cursor: 'pointer',
                fontSize: '12px', fontWeight: 700, color: '#fff',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Explorer →
            </button>
          </div>
        </div>

        {/* Card Business */}
        <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                Vous êtes une entreprise ?
              </p>
              <span style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
                color: '#fff', background: 'rgba(139,54,119,0.7)',
                border: '1px solid rgba(139,54,119,0.5)',
                borderRadius: '6px', padding: '2px 7px',
              }}>
                Business
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(188,205,232,0.55)', margin: 0 }}>
              Réserver une démo technique
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.open('https://enchanted-tools.com/demo', '_blank')}
            style={{
              flexShrink: 0,
              width: '42px', height: '42px', borderRadius: '50%',
              background: '#8B3677',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 18px rgba(139,54,119,0.4)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Card QR */}
        <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* QR placeholder */}
          <div style={{
            flexShrink: 0,
            width: '72px', height: '72px', borderRadius: '12px',
            background: '#fff',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            padding: '8px', gap: '4px',
          }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                background: i === 1 ? '#fff' : '#111',
                borderRadius: '3px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {i === 1 && <span style={{ fontSize: '8px', fontWeight: 800, color: '#111', lineHeight: 1 }}>QR</span>}
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: '0 0 5px', lineHeight: 1.3 }}>
              (Re)Venez avec vos proches !
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(188,205,232,0.55)', margin: '0 0 8px', lineHeight: 1.4 }}>
              Scannez pour votre promotion exclusive visiteur.
            </p>
            <span style={{
              fontSize: '11px', fontWeight: 700,
              color: '#22C55E',
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: '999px', padding: '3px 10px',
            }}>
              -10% pour vous et vos proches
            </span>
          </div>
        </div>
      </div>

      {/* Bouton retour accueil */}
      <button
        type="button"
        onClick={() => router.push('/')}
        style={{
          width: '100%', height: '56px', borderRadius: '999px',
          background: '#8B3677',
          border: 'none', cursor: 'pointer',
          fontSize: '16px', fontWeight: 700, color: '#ffffff',
          boxShadow: '0 0 28px rgba(139,54,119,0.45), 0 4px 16px rgba(139,54,119,0.3)',
          marginTop: '20px', flexShrink: 0,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        Retourner à l&apos;accueil
      </button>
    </main>
  )
}
