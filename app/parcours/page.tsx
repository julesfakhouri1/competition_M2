'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Outfit, Rajdhani } from 'next/font/google'

const outfit   = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['600', '700'] })

export default function ParcoursPage() {
  const router = useRouter()

  function choose(parcours: 'univers' | 'techno') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('et_parcours', parcours)
    }
    router.push('/choix-parcours')
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        .et-hdr   { animation: fadeUp  0.45s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .et-card1 { animation: cardIn  0.5s  cubic-bezier(0.16,1,0.3,1) 0.12s both; }
        .et-card2 { animation: cardIn  0.5s  cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .et-note  { animation: fadeUp  0.45s cubic-bezier(0.16,1,0.3,1) 0.30s both; }

        .et-parc-card {
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.18s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }
        .et-parc-card:active { transform: scale(0.96); }

        @media (prefers-reduced-motion: reduce) {
          .et-hdr, .et-card1, .et-card2, .et-note { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      <main
        className={outfit.className}
        style={{
          position: 'relative',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #0D1B35 0%, #1B1042 52%, #0E0820 100%)',
          paddingTop:    'max(2.5rem, env(safe-area-inset-top,    0px))',
          paddingBottom: 'max(2rem,   env(safe-area-inset-bottom, 0px))',
          paddingLeft:   'max(1.25rem, env(safe-area-inset-left,  0px))',
          paddingRight:  'max(1.25rem, env(safe-area-inset-right, 0px))',
        }}
      >
        {/* Halos décoratifs */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,146,247,0.32) 0%, transparent 62%)' }} />
          <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(195,66,150,0.22) 0%, transparent 62%)' }} />
        </div>

        {/* ── Header ── */}
        <div className="et-hdr" style={{ textAlign: 'center', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: rajdhani.style.fontFamily,
            fontSize: '13px', fontWeight: 700,
            letterSpacing: '0.22em',
            color: '#ffffff',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            Mirokaï Experience
          </p>
          <h1 style={{
            fontFamily: '"AcuminVariable", sans-serif',
            fontSize: '28px', fontWeight: 800,
            color: '#ffffff', lineHeight: 1.15, margin: 0,
          }}>
            Choisis ton parcours
          </h1>
        </div>

        {/* ── Cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1 }}>

          {/* Card 1 — L'Univers Mirokaï */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => choose('univers')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && choose('univers')}
            className="et-parc-card et-card1"
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'linear-gradient(160deg, #0D2B6B 0%, #1E0F5C 50%, #3B0D6E 100%)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px 20px 12px',
              gap: '14px',
            }}
          >
            {/* Texte */}
            <div>
              <p style={{
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.18em',
                color: 'rgba(0,200,255,0.85)',
                textTransform: 'uppercase',
                margin: '0 0 6px',
              }}>
                Parcours 1
              </p>
              <h2 style={{
                fontFamily: '"AcuminVariable", sans-serif',
                fontSize: '24px', fontWeight: 800,
                color: '#ffffff', lineHeight: 1.15, margin: '0 0 5px',
              }}>
                L&apos;Univers Mirokaï
              </h2>
              <p style={{
                fontSize: '14px', color: 'rgba(188,205,232,0.65)',
                lineHeight: 1.4, margin: 0,
              }}>
                Plonge dans l&apos;histoire
              </p>
            </div>

            {/* Zone image personnage */}
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              height: '180px',
            }}>
              <Image
                src="/mirokai.webp"
                alt="Personnage Mirokaï"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                priority
              />
            </div>
          </div>

          {/* Card 2 — La Technologie */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => choose('techno')}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && choose('techno')}
            className="et-parc-card et-card2"
            style={{
              borderRadius: '24px',
              overflow: 'hidden',
              background: 'linear-gradient(160deg, #0F1F5A 0%, #1A0D52 50%, #2D0B5A 100%)',
              border: '1.5px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px 20px 12px',
              gap: '14px',
            }}
          >
            {/* Texte */}
            <div>
              <p style={{
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.18em',
                color: 'rgba(0,200,255,0.85)',
                textTransform: 'uppercase',
                margin: '0 0 6px',
              }}>
                Parcours 2
              </p>
              <h2 style={{
                fontFamily: '"AcuminVariable", sans-serif',
                fontSize: '24px', fontWeight: 800,
                color: '#ffffff', lineHeight: 1.15, margin: '0 0 5px',
              }}>
                La Technologie
              </h2>
              <p style={{
                fontSize: '14px', color: 'rgba(188,205,232,0.65)',
                lineHeight: 1.4, margin: 0,
              }}>
                Usages, fabrication, innovations
              </p>
            </div>

            {/* Zone image personnage */}
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              height: '180px',
            }}>
              <Image
                src="/miroka.webp"
                alt="Robot Mirokaï"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
          </div>
        </div>

        {/* ── Note ── */}
        <p className="et-note" style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center',
          fontSize: '12px',
          color: 'rgba(188,205,232,0.45)',
          marginTop: '20px',
          lineHeight: 1.5,
        }}>
          Tu peux revenir sur l&apos;autre parcours à tout moment.
        </p>
      </main>
    </>
  )
}
