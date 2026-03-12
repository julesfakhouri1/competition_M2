'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Outfit, Rajdhani } from 'next/font/google'
import { createClient } from '@/lib/supabase'

const outfit   = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['600', '700'] })

function IconMail() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
    </svg>
  )
}
function IconLock() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [focused,  setFocused]  = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }
    router.push('/admin/dashboard')
    router.refresh()
  }

  function fieldStyle(field: string): React.CSSProperties {
    const active = focused === field
    return {
      background:   active ? 'rgba(0,200,255,0.06)' : 'rgba(255,255,255,0.05)',
      borderWidth:  '1.5px',
      borderStyle:  'solid',
      borderColor:  active ? 'rgba(0,200,255,0.55)' : 'rgba(255,255,255,0.12)',
      boxShadow:    active ? '0 0 0 3px rgba(0,200,255,0.08)' : 'none',
      transition:   'all 0.2s ease',
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .et-login-card { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        @media (prefers-reduced-motion: reduce) { .et-login-card { animation: none; } }

        .et-field::placeholder { color: rgba(188,205,232,0.38); }
        .et-field:focus { outline: none; }

        .et-login-btn {
          transition: box-shadow 0.22s ease, transform 0.16s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .et-login-btn:hover { box-shadow: 0 0 40px rgba(0,200,255,0.5), 0 4px 16px rgba(0,146,247,0.35) !important; }
        .et-login-btn:active { transform: scale(0.97); }
      `}</style>

      <div
        className={`${outfit.className} min-h-screen flex flex-col items-center justify-center overflow-hidden px-6`}
        style={{ background: 'linear-gradient(180deg, #0D1B35 0%, #1B1042 52%, #0E0820 100%)' }}
      >
        {/* Halos */}
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden">
          <div style={{ position:'absolute', top:'-80px', left:'-60px', width:'340px', height:'340px', borderRadius:'50%', background:'radial-gradient(circle, rgba(0,146,247,0.32) 0%, transparent 62%)' }} />
          <div style={{ position:'absolute', bottom:'-80px', right:'-60px', width:'340px', height:'340px', borderRadius:'50%', background:'radial-gradient(circle, rgba(195,66,150,0.2) 0%, transparent 62%)' }} />
        </div>

        {/* Carte */}
        <div
          className="et-login-card relative z-10 w-full max-w-sm"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgba(255,255,255,0.1)',
            borderRadius: '28px',
            padding: '36px 24px 32px',
          }}
        >
          {/* En-tête */}
          <div className="flex flex-col items-center gap-4 mb-9">
            <Image src="/logo_1.svg" alt="Enchanted Tools" width={72} height={72} priority />
            <div className="text-center">
              <p style={{ fontFamily: rajdhani.style.fontFamily, fontSize: '13px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(0,200,255,0.8)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Enchanted Tools
              </p>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                Espace admin
              </h1>
              <p style={{ fontSize: '13px', color: 'rgba(188,205,232,0.55)', marginTop: '5px' }}>
                Connectez-vous pour continuer
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} noValidate className="flex flex-col gap-3">

            {/* Email */}
            <label className="flex flex-col gap-1.5">
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(188,205,232,0.5)', textTransform: 'uppercase' }}>
                Email
              </span>
              <div className="relative flex items-center">
                <span className="absolute left-4 pointer-events-none" style={{ color: focused === 'email' ? 'rgba(0,200,255,0.7)' : 'rgba(188,205,232,0.3)', transition: 'color 0.2s' }}>
                  <IconMail />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  autoComplete="email"
                  inputMode="email"
                  required
                  className="et-field w-full text-white text-sm rounded-2xl"
                  style={{ ...fieldStyle('email'), height: '52px', paddingLeft: '44px', paddingRight: '16px' }}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </label>

            {/* Mot de passe */}
            <label className="flex flex-col gap-1.5">
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(188,205,232,0.5)', textTransform: 'uppercase' }}>
                Mot de passe
              </span>
              <div className="relative flex items-center">
                <span className="absolute left-4 pointer-events-none" style={{ color: focused === 'password' ? 'rgba(0,200,255,0.7)' : 'rgba(188,205,232,0.3)', transition: 'color 0.2s' }}>
                  <IconLock />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="et-field w-full text-white text-sm rounded-2xl"
                  style={{ ...fieldStyle('password'), height: '52px', paddingLeft: '44px', paddingRight: '16px' }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                />
              </div>
            </label>

            {error && (
              <p role="alert" className="text-xs text-center" style={{ color: '#fca5a5', marginTop: '2px' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="et-login-btn w-full text-white font-semibold text-sm rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                height: '52px',
                marginTop: '6px',
                background: 'linear-gradient(90deg, #00C8FF 0%, #0092F7 100%)',
                boxShadow: '0 0 28px rgba(0,200,255,0.32), 0 4px 16px rgba(0,146,247,0.22)',
                border: 'none',
              }}
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
