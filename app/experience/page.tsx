'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Outfit, Rajdhani } from 'next/font/google'
import { type Locale, getLocaleFromCookie, translations } from '@/lib/i18n'

const outfit   = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['600', '700'] })

const AGE_RANGES = {
  fr: ['Moins de 10 ans', '10 – 14 ans', '15 – 17 ans', '18 – 25 ans', '26 – 40 ans', 'Plus de 40 ans'],
  en: ['Under 10', '10 – 14', '15 – 17', '18 – 25', '26 – 40', 'Over 40'],
}

// Icône SVG inline
function IconUser()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> }
function IconMail()  { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg> }
function IconChevron({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.22s ease' }}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function ExperiencePage() {
  const router    = useRouter()
  const dropRef   = useRef<HTMLDivElement>(null)

  const [locale,    setLocale]    = useState<Locale>('fr')
  const [firstName, setFirstName] = useState('')
  const [email,     setEmail]     = useState('')
  const [age,       setAge]       = useState('')
  const [error,      setError]      = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading,    setLoading]    = useState(false)
  const [ageOpen,    setAgeOpen]    = useState(false)
  const [focused,    setFocused]    = useState<string | null>(null)

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  useEffect(() => { setLocale(getLocaleFromCookie()) }, [])

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setAgeOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const t = translations[locale]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!firstName.trim() || !email.trim() || !age) { setError(t.formErrorRequired); return }
    if (!isValidEmail(email)) { setEmailError(t.formErrorEmail); return }
    setLoading(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('et_visitor', JSON.stringify({ firstName, email, age }))
    }
    router.push('/parcours')
  }

  function inputStyle(field: string): React.CSSProperties {
    const active = focused === field
    return {
      background: active ? 'rgba(0,200,255,0.06)' : 'rgba(255,255,255,0.06)',
      borderWidth: '1.5px',
      borderStyle: 'solid',
      borderColor: active ? 'rgba(0,200,255,0.55)' : 'rgba(255,255,255,0.15)',
      boxShadow: active ? '0 0 0 3px rgba(0,200,255,0.08)' : 'none',
      transition: 'all 0.2s ease',
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .et-form-card { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        @media (prefers-reduced-motion: reduce) { .et-form-card { animation: none; } }

        .et-field::placeholder { color: rgba(188,205,232,0.45); }
        .et-field:focus { outline: none; }

        .et-cta {
          -webkit-tap-highlight-color: transparent;
          transition: box-shadow 0.22s ease, transform 0.16s ease;
        }
        .et-cta:hover  { box-shadow: 0 0 40px rgba(0,200,255,0.5), 0 4px 16px rgba(0,146,247,0.35) !important; }
        .et-cta:active { transform: scale(0.97); }

        .et-age-opt { -webkit-tap-highlight-color: transparent; transition: background 0.15s ease; }
        .et-age-opt:hover { background: rgba(255,255,255,0.06) !important; }
      `}</style>

      <main
        className={`${outfit.className} relative flex flex-col items-center justify-center overflow-hidden`}
        style={{
          height: '100dvh',
          background: 'linear-gradient(180deg, #0D1B35 0%, #1B1042 52%, #0E0820 100%)',
          paddingTop:    'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          paddingLeft:   'max(1.25rem, env(safe-area-inset-left, 0px))',
          paddingRight:  'max(1.25rem, env(safe-area-inset-right, 0px))',
        }}
      >
        {/* Halos décoratifs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position:'absolute', top:'-80px', left:'-60px', width:'340px', height:'340px', borderRadius:'50%', background:'radial-gradient(circle, rgba(0,146,247,0.32) 0%, transparent 62%)' }} />
          <div style={{ position:'absolute', bottom:'-60px', right:'-60px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(195,66,150,0.22) 0%, transparent 62%)' }} />
        </div>

        {/* Carte */}
        <div
          className="et-form-card relative z-10 w-full max-w-sm"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '28px',
            padding: '32px 24px 28px',
          }}
        >
          {/* En-tête carte */}
          <div className="text-center mb-8">
            <p style={{ fontFamily: rajdhani.style.fontFamily, fontSize: '13px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(0,200,255,0.8)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Enchanted Tools
            </p>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              {locale === 'fr' ? 'Bienvenue' : 'Welcome'}
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(188,205,232,0.6)', marginTop: '6px' }}>
              {locale === 'fr' ? 'Quelques infos avant de commencer' : 'A few details before you start'}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">

            {/* Prénom */}
            <label className="flex flex-col gap-1.5">
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(188,205,232,0.55)', textTransform: 'uppercase' }}>
                {t.formFirstName}
              </span>
              <div className="relative flex items-center">
                <span className="absolute left-4 pointer-events-none" style={{ color: focused === 'firstName' ? 'rgba(0,200,255,0.7)' : 'rgba(188,205,232,0.35)', transition: 'color 0.2s' }}>
                  <IconUser />
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={locale === 'fr' ? 'Votre prénom' : 'Your first name'}
                  autoComplete="given-name"
                  className="et-field w-full text-white text-sm rounded-2xl"
                  style={{ ...inputStyle('firstName'), height: '52px', paddingLeft: '44px', paddingRight: '16px' }}
                  onFocus={() => setFocused('firstName')}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </label>

            {/* Email */}
            <label className="flex flex-col gap-1.5">
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(188,205,232,0.55)', textTransform: 'uppercase' }}>
                {t.formEmail}
              </span>
              <div className="relative flex items-center">
                <span className="absolute left-4 pointer-events-none" style={{ color: emailError ? 'rgba(252,165,165,0.8)' : focused === 'email' ? 'rgba(0,200,255,0.7)' : 'rgba(188,205,232,0.35)', transition: 'color 0.2s' }}>
                  <IconMail />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError('') }}
                  placeholder={locale === 'fr' ? 'votre@email.com' : 'your@email.com'}
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  className="et-field w-full text-white text-sm rounded-2xl"
                  style={{
                    ...inputStyle('email'),
                    height: '52px', paddingLeft: '44px', paddingRight: '16px',
                    ...(emailError ? { borderColor: 'rgba(252,165,165,0.6)', boxShadow: '0 0 0 3px rgba(252,165,165,0.08)', background: 'rgba(252,165,165,0.04)' } : {}),
                  }}
                  onFocus={() => setFocused('email')}
                  onBlur={() => {
                    setFocused(null)
                    if (email && !isValidEmail(email)) setEmailError(t.formErrorEmail)
                  }}
                />
              </div>
              {emailError && (
                <p id="email-error" role="alert" style={{ fontSize: '12px', color: '#fca5a5', marginTop: '2px', paddingLeft: '4px' }}>
                  {emailError}
                </p>
              )}
            </label>

            {/* Âge */}
            <div className="flex flex-col gap-1.5" ref={dropRef}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(188,205,232,0.55)', textTransform: 'uppercase' }}>
                {t.formAge}
              </span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAgeOpen((o) => !o)}
                  aria-haspopup="listbox"
                  aria-expanded={ageOpen}
                  className="w-full flex items-center justify-between rounded-2xl text-sm"
                  style={{
                    ...inputStyle(ageOpen ? 'age' : ''),
                    height: '52px', paddingLeft: '16px', paddingRight: '16px',
                    color: age ? '#fff' : 'rgba(188,205,232,0.45)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <span>{age || (locale === 'fr' ? 'Sélectionner votre âge' : 'Select your age')}</span>
                  <span style={{ color: 'rgba(188,205,232,0.5)' }}>
                    <IconChevron open={ageOpen} />
                  </span>
                </button>

                {ageOpen && (
                  <div
                    className="absolute left-0 right-0 mt-2 z-20 overflow-hidden"
                    role="listbox"
                    style={{
                      background: 'rgba(14,12,42,0.96)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '18px',
                    }}
                  >
                    {AGE_RANGES[locale].map((range, i) => (
                      <button
                        key={range}
                        type="button"
                        role="option"
                        aria-selected={age === range}
                        onClick={() => { setAge(range); setAgeOpen(false) }}
                        className="et-age-opt w-full text-left px-4 py-3 text-sm flex items-center justify-between"
                        style={{
                          color: age === range ? '#00C8FF' : 'rgba(188,205,232,0.8)',
                          background: age === range ? 'rgba(0,200,255,0.08)' : 'transparent',
                          borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        {range}
                        {age === range && (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7l3.5 3.5L12 3" stroke="#00C8FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <p className="text-xs text-center" style={{ color: '#fca5a5', marginTop: '2px' }}>{error}</p>
            )}

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="et-cta w-full text-white font-semibold text-sm rounded-2xl disabled:opacity-50"
              style={{
                height: '54px',
                marginTop: '6px',
                background: 'linear-gradient(90deg, #00C8FF 0%, #0092F7 100%)',
                boxShadow: '0 0 28px rgba(0,200,255,0.32), 0 4px 16px rgba(0,146,247,0.25)',
                border: 'none',
              }}
            >
              {loading ? '…' : t.formSubmit}
            </button>
          </form>
        </div>

        {/* Mention confidentialité */}
        <p
          className="relative z-10 text-xs text-center mt-5"
          style={{ color: 'rgba(188,205,232,0.38)' }}
        >
          {t.formPrivacy}
        </p>
      </main>
    </>
  )
}
