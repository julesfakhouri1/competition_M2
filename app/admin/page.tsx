'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(180deg, #0D1B35 0%, #1B1042 52%, #0E0820 100%)' }}
    >
      {/* Halos décoratifs */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', top: '-80px', left: '-60px',
          width: '340px', height: '340px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,146,247,0.3) 0%, transparent 62%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', right: '-60px',
          width: '340px', height: '340px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(195,66,150,0.2) 0%, transparent 62%)',
        }} />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo + titre */}
        <div className="mb-10 text-center flex flex-col items-center gap-4">
          <Image src="/logo_1.svg" alt="Enchanted Tools" width={72} height={72} priority />
          <div>
            <h1 className="text-lg font-bold text-white tracking-widest uppercase">
              Enchanted Tools
            </h1>
            <p style={{ color: 'rgba(188,205,232,0.7)', fontSize: '13px', marginTop: '4px' }}>
              Espace administrateur
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-[rgba(188,205,232,0.4)] focus:outline-none transition-colors"
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255,255,255,0.12)',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(0,200,255,0.5)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-[rgba(188,205,232,0.4)] focus:outline-none transition-colors"
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255,255,255,0.12)',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(0,200,255,0.5)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
          />

          {error && (
            <p className="text-red-400 text-xs text-center pt-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-semibold rounded-xl py-3 text-sm text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(90deg, #00C8FF 0%, #0092F7 100%)',
              boxShadow: '0 0 24px rgba(0,200,255,0.3)',
              marginTop: '8px',
            }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
