'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Outfit, Rajdhani } from 'next/font/google'
import { type Locale, getLocaleFromCookie, translations } from '@/lib/i18n'

const outfit   = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['600', '700'] })

export default function ModulesPage() {
  const router = useRouter()
  const [locale,   setLocale]   = useState<Locale>('fr')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [loading,  setLoading]  = useState(false)

  useEffect(() => { setLocale(getLocaleFromCookie()) }, [])

  const t     = translations[locale]
  const items = t.checklistItems.split('|')

  function toggle(i: number) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  async function handleValidate() {
    if (selected.size === 0) return
    setLoading(true)
    try {
      const choices = [...selected].map(i => items[i])
      const current = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('et_visitor') ?? '{}')
        : {}
      const { saveVisitor } = await import('@/lib/actions')
      await saveVisitor({
        first_name: current.firstName ?? '',
        email:      current.email     ?? '',
        age:        current.age       ?? '',
        activities: choices,
      })
      localStorage.setItem('et_visitor', JSON.stringify({ ...current, activities: choices }))
    } catch {
      // Silencieux — l'expérience continue même si la sauvegarde échoue
    }
    router.push('/')
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .et-item {
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
          -webkit-tap-highlight-color: transparent;
          transition: background 0.18s ease, border-color 0.18s ease;
          cursor: pointer;
        }
        .et-item:active { transform: scale(0.98); }

        @media (prefers-reduced-motion: reduce) {
          .et-item { animation: none; }
        }

        .et-validate {
          -webkit-tap-highlight-color: transparent;
          transition: box-shadow 0.22s ease, opacity 0.2s ease, transform 0.15s ease;
        }
        .et-validate:not(:disabled):hover {
          box-shadow: 0 0 40px rgba(0,200,255,0.5), 0 4px 16px rgba(0,146,247,0.35) !important;
        }
        .et-validate:not(:disabled):active { transform: scale(0.97); }
      `}</style>

      <main
        className={`${outfit.className} relative flex flex-col`}
        style={{
          height: '100dvh',
          background: 'linear-gradient(180deg, #0D1B35 0%, #1B1042 52%, #0E0820 100%)',
          paddingTop:    'max(2.5rem, env(safe-area-inset-top, 0px))',
          paddingBottom: 'max(2rem,   env(safe-area-inset-bottom, 0px))',
          paddingLeft:   'max(1.5rem, env(safe-area-inset-left, 0px))',
          paddingRight:  'max(1.5rem, env(safe-area-inset-right, 0px))',
        }}
      >
        {/* Halos */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position:'absolute', top:'-80px', left:'-60px', width:'320px', height:'320px', borderRadius:'50%', background:'radial-gradient(circle, rgba(0,146,247,0.3) 0%, transparent 62%)' }} />
          <div style={{ position:'absolute', bottom:'-60px', right:'-60px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(195,66,150,0.2) 0%, transparent 62%)' }} />
        </div>

        {/* Contenu scrollable (header + liste) */}
        <div className="relative z-10 flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
          {/* En-tête */}
          <div className="mb-8">
            <p style={{ fontFamily: rajdhani.style.fontFamily, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(0,200,255,0.75)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Enchanted Tools
            </p>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '4px' }}>
              {t.checklistTitle}
            </h1>
            <p style={{ fontSize: '13px', color: 'rgba(188,205,232,0.55)' }}>
              {t.checklistSubtitle}
            </p>
          </div>

          {/* Liste */}
          <div className="flex flex-col gap-3 pb-4">
            {items.map((item, i) => {
              const checked = selected.has(i)
              return (
                <button
                  key={i}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggle(i)}
                  className="et-item flex items-center gap-4 w-full rounded-2xl px-5"
                  style={{
                    animationDelay: `${i * 0.07}s`,
                    height: '60px',
                    background: checked ? 'rgba(0,200,255,0.08)' : 'rgba(255,255,255,0.05)',
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    borderColor: checked ? 'rgba(0,200,255,0.5)' : 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  {/* Checkbox */}
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-md"
                    style={{
                      width: '22px', height: '22px',
                      borderWidth: '1.5px',
                      borderStyle: 'solid',
                      borderColor: checked ? '#00C8FF' : 'rgba(255,255,255,0.35)',
                      background: checked ? 'linear-gradient(135deg, #00C8FF, #0092F7)' : 'transparent',
                      transition: 'all 0.18s ease',
                      flexShrink: 0,
                    }}
                  >
                    {checked && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>

                  {/* Label */}
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: checked ? '#ffffff' : 'rgba(188,205,232,0.85)' }}
                  >
                    {item}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Bouton valider (pied de page fixe dans le viewport) */}
        <div className="relative z-10 mt-4">
          <button
            type="button"
            onClick={handleValidate}
            disabled={selected.size === 0 || loading}
            className="et-validate w-full text-white font-semibold text-sm rounded-2xl"
            style={{
              height: '54px',
              background: selected.size > 0
                ? 'linear-gradient(90deg, #00C8FF 0%, #0092F7 100%)'
                : 'rgba(255,255,255,0.07)',
              boxShadow: selected.size > 0 ? '0 0 28px rgba(0,200,255,0.3), 0 4px 16px rgba(0,146,247,0.22)' : 'none',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: selected.size > 0 ? 'transparent' : 'rgba(255,255,255,0.1)',
              color: selected.size > 0 ? '#ffffff' : 'rgba(188,205,232,0.4)',
              transition: 'all 0.25s ease',
            }}
          >
            {loading ? '…' : t.checklistValidate}
          </button>
        </div>
      </main>
    </>
  )
}
