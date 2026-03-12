'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Outfit, Rajdhani } from 'next/font/google'
import { type Locale, getLocaleFromCookie } from '@/lib/i18n'
import { createClient } from '@/lib/supabase'

const outfit   = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['600', '700'] })

const RATING_COLORS = [
  '#4361EE', '#3A0CA3', '#7209B7', '#9B2D8E', '#C2185B',
  '#F9A825', '#F57C00', '#E64A19', '#D32F2F', '#7B1D1D',
]

export default function AvisPage() {
  const router = useRouter()
  const [locale,    setLocale]    = useState<Locale>('fr')
  const [rating,    setRating]    = useState<number | null>(null)
  const [comment,   setComment]   = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  useEffect(() => { setLocale(getLocaleFromCookie()) }, [])

  async function handleSubmit() {
    setLoading(true)
    try {
      const supabase = createClient()
      let visitorEmail: string | null = null
      if (typeof window !== 'undefined') {
        const v = localStorage.getItem('et_visitor')
        if (v) visitorEmail = JSON.parse(v)?.email ?? null
      }
      await supabase.from('feedback').insert({ visitor_email: visitorEmail, rating, comment: comment || null })
    } catch {}
    setLoading(false)
    router.push('/decouvrir')
  }

  function handleSkip() {
    router.push('/decouvrir')
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
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
        <span style={{ fontFamily: rajdhani.style.fontFamily, fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
          {locale === 'en' ? 'End of visit' : 'Fin de visite'}
        </span>
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Question */}
        <div>
          <p style={{
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em',
            color: 'rgba(188,205,232,0.55)', textTransform: 'uppercase',
            margin: '0 0 10px',
          }}>
            {locale === 'en' ? 'Your feedback' : 'Votre avis'}
          </p>
          <h1 style={{
            fontFamily: '"AcuminVariable", sans-serif',
            fontSize: '26px', fontWeight: 800,
            color: '#ffffff', lineHeight: 1.2, margin: 0,
          }}>
            {locale === 'en'
              ? 'How did you find the Mirokaï experience?'
              : "Comment avez-vous trouvé l'expérience Mirokaï ?"}
          </h1>
        </div>

        {/* Échelle de notation 1-10 */}
        <div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', marginBottom: '10px' }}>
            {Array.from({ length: 10 }, (_, i) => {
              const n = i + 1
              const isSelected = rating === n
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  style={{
                    flex: 1,
                    aspectRatio: '1',
                    borderRadius: '50%',
                    background: isSelected ? RATING_COLORS[i] : 'rgba(255,255,255,0.08)',
                    border: isSelected
                      ? `2.5px solid rgba(255,255,255,0.9)`
                      : `1.5px solid ${RATING_COLORS[i]}55`,
                    color: isSelected ? '#fff' : RATING_COLORS[i],
                    fontSize: 'clamp(11px, 3vw, 14px)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.15s ease, transform 0.1s ease',
                    transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    boxShadow: isSelected ? `0 0 16px ${RATING_COLORS[i]}88` : 'none',
                    WebkitTapHighlightColor: 'transparent',
                    minWidth: 0,
                  }}
                >
                  {n}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: 'rgba(188,205,232,0.45)', fontWeight: 500 }}>
              {locale === 'en' ? 'Not at all' : 'Pas du tout'}
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(188,205,232,0.45)', fontWeight: 500 }}>
              {locale === 'en' ? 'Very much' : 'Vraiment beaucoup'}
            </span>
          </div>
        </div>

        {/* Commentaire */}
        <div>
          <p style={{ fontSize: '14px', color: 'rgba(188,205,232,0.7)', margin: '0 0 10px' }}>
            {locale === 'en' ? 'A comment? (optional)' : 'Un commentaire ? (optionnel)'}
          </p>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={locale === 'en' ? 'Share your experience…' : "Partagez votre ressenti de l'expérience Mirokaï"}
            rows={4}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              padding: '14px 16px',
              fontSize: '14px', color: '#fff',
              lineHeight: 1.55,
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {submitted && (
          <p style={{ fontSize: '14px', textAlign: 'center', color: 'rgba(188,205,232,0.7)', margin: 0 }}>
            {locale === 'en' ? 'Thank you! Your feedback means a lot to us!' : 'Merci ! votre avis compte beaucoup pour nous !'}
          </p>
        )}
      </div>

      {/* Boutons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '28px' }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || rating === null}
          style={{
            width: '100%', height: '56px', borderRadius: '999px',
            background: '#8B3677',
            border: 'none', cursor: rating === null ? 'default' : 'pointer',
            fontSize: '16px', fontWeight: 700, color: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: rating !== null ? '0 0 28px rgba(139,54,119,0.45), 0 4px 16px rgba(139,54,119,0.3)' : 'none',
            opacity: rating === null ? 0.5 : 1,
            transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {loading ? '…' : (locale === 'en' ? 'Send ✓' : 'Envoyer ✓')}
        </button>

        <button
          type="button"
          onClick={handleSkip}
          style={{
            width: '100%', height: '56px', borderRadius: '999px',
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(255,255,255,0.18)',
            cursor: 'pointer',
            fontSize: '16px', fontWeight: 600, color: '#ffffff',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {locale === 'en' ? 'Skip' : 'Passer'}
        </button>
      </div>
    </main>
  )
}
