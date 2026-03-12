'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Outfit, Rajdhani } from 'next/font/google'
import LangSwitcher from '@/components/LangSwitcher'
import { type Locale, getLocaleFromCookie, translations } from '@/lib/i18n'

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['600', '700'] })

export default function LandingPage() {
  const router = useRouter()
  const [locale, setLocale] = useState<Locale>('fr')
  useEffect(() => { setLocale(getLocaleFromCookie()) }, [])
  const t = translations[locale]

  return (
    <>
      <style>{`
        @keyframes floatGlow {
          0%, 100% { opacity: 0.22; transform: translate(-50%,-50%) scale(1);   }
          50%       { opacity: 0.38; transform: translate(-50%,-50%) scale(1.1); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes logoAppear {
          from { opacity: 0; transform: scale(0.84); }
          to   { opacity: 1; transform: scale(1);    }
        }
        .et-logo { animation: logoAppear  0.65s cubic-bezier(0.16,1,0.3,1)        both; }
        .et-f1   { animation: fadeSlideUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.10s both; }
        .et-f2   { animation: fadeSlideUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.20s both; }
        .et-f3   { animation: fadeSlideUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.32s both; }
        .et-f4   { animation: fadeSlideUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.44s both; }
        .et-f5   { animation: fadeSlideUp 0.65s cubic-bezier(0.16,1,0.3,1) 0.56s both; }

        .et-float {
          position: absolute; top: 50%; left: 50%;
          animation: floatGlow 4.5s ease-in-out infinite;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .et-logo,.et-f1,.et-f2,.et-f3,.et-f4,.et-f5 {
            animation: none !important; opacity: 1 !important; transform: none !important;
          }
          .et-float { animation: none !important; transform: translate(-50%,-50%) !important; }
          .et-btn-primary { transition: none !important; }
        }

        .et-btn-primary:focus-visible,
        .et-btn-sec:focus-visible,
        .et-skip:focus-visible {
          outline: 3px solid #00C8FF; outline-offset: 3px;
        }

        .et-btn-primary {
          -webkit-tap-highlight-color: transparent;
          transition: box-shadow 0.22s ease, transform 0.16s ease;
        }
        .et-btn-primary:hover {
          box-shadow: 0 0 52px rgba(0,200,255,0.65), 0 6px 28px rgba(0,146,247,0.4) !important;
          transform: translateY(-2px);
        }
        .et-btn-primary:active {
          transform: scale(0.97) !important;
          box-shadow: 0 0 18px rgba(0,200,255,0.3) !important;
        }

        .et-btn-sec {
          -webkit-tap-highlight-color: transparent;
          transition: background 0.18s ease;
        }
        .et-btn-sec:hover  { background: rgba(255,255,255,0.12) !important; }
        .et-btn-sec:active { background: rgba(255,255,255,0.18) !important; transform: scale(0.97); }

        .et-skip {
          position: absolute; top: -100px; left: 1rem;
          padding: 0.5rem 1rem; background: #fff; color: #000;
          border-radius: 0.5rem; font-weight: 600; font-size: 0.9rem;
          z-index: 100; transition: top 0.2s;
        }
        .et-skip:focus { top: 1rem; }
      `}</style>

      <main
        className={`${outfit.className} relative flex flex-col items-center overflow-hidden`}
        style={{
          background: 'linear-gradient(180deg, #0D1B35 0%, #1B1042 52%, #0E0820 100%)',
          height: '100dvh',
        }}
      >
        <a href="#et-content" className="et-skip">{t.skipLink}</a>

        {/* Sélecteur de langue */}
        <div className="fixed top-6 right-6 z-50">
          <LangSwitcher locale={locale} onLocaleChange={setLocale} />
        </div>

        {/* Halos décoratifs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{
            position: 'absolute', top: '-90px', left: '-70px',
            width: '380px', height: '380px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,146,247,0.4) 0%, transparent 62%)',
          }} />
          <div style={{
            position: 'absolute', top: '-70px', right: '-70px',
            width: '340px', height: '340px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(120,40,220,0.32) 0%, transparent 62%)',
          }} />
          <div className="et-float" style={{
            width: '520px', height: '520px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(195,66,150,0.2) 0%, transparent 62%)',
          }} />
        </div>

        {/* Contenu — distribué sur toute la hauteur */}
        <div
          id="et-content"
          className="relative z-10 flex flex-col items-center w-full max-w-sm mx-auto"
          style={{
            height: '100%',
            justifyContent: 'space-between',
            paddingTop:    'max(2.5rem, env(safe-area-inset-top,    0px))',
            paddingBottom: 'max(2rem,   env(safe-area-inset-bottom, 0px))',
            paddingLeft:   'max(1.5rem, env(safe-area-inset-left,   0px))',
            paddingRight:  'max(1.5rem, env(safe-area-inset-right,  0px))',
          }}
        >

          {/* Logo + marque */}
          <div className="flex flex-col items-center">
            <div className="et-logo mb-3">
              <Image src="/logo_1.svg" alt="Logo Enchanted Tools" width={100} height={100} priority />
            </div>
            <div className="et-f1 flex flex-col items-center" role="banner">
              <p style={{
                fontFamily: rajdhani.style.fontFamily,
                fontSize: '20px', fontWeight: 700,
                letterSpacing: '0.22em', color: '#ffffff',
                textTransform: 'uppercase', margin: 0,
              }}>
                Enchanted Tools
              </p>
              <p style={{
                fontSize: '12px', fontWeight: 400,
                color: 'rgba(188,205,232,0.92)',
                marginTop: '4px', letterSpacing: '0.06em',
              }}>
                {t.baseline}
              </p>
            </div>
          </div>

          {/* Titre + description */}
          <section className="et-f2 flex flex-col items-center text-center" aria-labelledby="et-hero-title">
            <h1
              id="et-hero-title"
              style={{
                fontSize: 'clamp(24px, 7.5vw, 30px)',
                fontWeight: 900, color: '#ffffff',
                lineHeight: '1.18', margin: '0 0 10px',
              }}
            >
              {t.heroTitle}
            </h1>
            <p style={{
              fontSize: '14px', fontWeight: 400,
              color: 'rgba(178,196,228,0.92)',
              lineHeight: '1.6', margin: 0,
            }}>
              {t.heroDesc}
            </p>
          </section>

          {/* Cercle glassmorphism */}
          <div className="et-f3 relative flex items-center justify-center" aria-hidden="true">
            <div className="absolute rounded-full" style={{
              width: '260px', height: '260px',
              background: 'radial-gradient(circle, rgba(195,66,150,0.16) 0%, rgba(100,30,180,0.08) 45%, transparent 70%)',
            }} />
            <div className="absolute rounded-full" style={{
              width: '200px', height: '200px',
              background: 'radial-gradient(circle, rgba(195,66,150,0.1) 0%, transparent 65%)',
              border: '1px solid rgba(195,66,150,0.08)',
            }} />
            <div style={{
              width: '164px', height: '164px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.11)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 40px rgba(195,66,150,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Image src="/logo_2.svg" alt="" width={110} height={110} />
            </div>
          </div>

          {/* Boutons */}
          <div className="et-f4 flex flex-col gap-3 w-full">
            <button
              type="button"
              className="et-btn-primary w-full"
              aria-label={t.cta}
              onClick={() => router.push('/parcours')}
              style={{
                minHeight: '52px',
                padding: '14px 32px', borderRadius: '999px',
                background: 'linear-gradient(90deg, #00C8FF 0%, #0092F7 100%)',
                boxShadow: '0 0 32px rgba(0,200,255,0.38), 0 4px 20px rgba(0,146,247,0.28)',
                color: '#ffffff', fontSize: '16px', fontWeight: 600,
                fontFamily: 'inherit', border: 'none',
                letterSpacing: '0.01em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              {t.cta} <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className="et-btn-sec w-full"
              aria-label={t.games}
              style={{
                minHeight: '48px',
                padding: '13px 16px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.11)',
                color: '#ffffff', fontSize: '15px',
                fontWeight: 500, fontFamily: 'inherit',
              }}
            >
              {t.games}
            </button>
          </div>

        </div>
      </main>
    </>
  )
}
