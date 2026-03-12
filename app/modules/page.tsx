'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Outfit, Rajdhani } from 'next/font/google'
import { type Locale, getLocaleFromCookie, translations } from '@/lib/i18n'
import { createClient } from '@/lib/supabase'

const outfit   = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['600', '700'] })

const NODE_SIZE  = 68
const SPACING_Y  = 118
const TOP_OFFSET = 24
const LEFT_PCT   = 20   // % from left — left-side nodes center
const RIGHT_PCT  = 75   // % from left — right-side nodes center

function StarIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size * 29 / 30} viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.034 1.7263C14.0924 1.60826 14.1826 1.50891 14.2945 1.43944C14.4064 1.36997 14.5355 1.33316 14.6672 1.33316C14.7989 1.33316 14.928 1.36997 15.0399 1.43944C15.1518 1.50891 15.242 1.60826 15.3005 1.7263L18.3801 7.96414C18.5829 8.37471 18.8824 8.72992 19.2528 8.99927C19.6231 9.26863 20.0533 9.44409 20.5064 9.5106L27.3935 10.5185C27.524 10.5374 27.6466 10.5924 27.7475 10.6774C27.8483 10.7623 27.9234 10.8738 27.9641 10.9992C28.0049 11.1246 28.0098 11.2589 27.9782 11.3869C27.9467 11.515 27.8799 11.6316 27.7855 11.7236L22.8048 16.5737C22.4763 16.8938 22.2306 17.2889 22.0887 17.725C21.9468 18.1612 21.913 18.6252 21.9902 19.0773L23.1661 25.9298C23.1891 26.0602 23.175 26.1945 23.1254 26.3173C23.0758 26.4401 22.9927 26.5465 22.8855 26.6243C22.7784 26.7022 22.6515 26.7483 22.5193 26.7575C22.3872 26.7667 22.2551 26.7386 22.1382 26.6763L15.9817 23.4394C15.5761 23.2264 15.1247 23.1151 14.6666 23.1151C14.2084 23.1151 13.757 23.2264 13.3514 23.4394L7.19621 26.6763C7.07933 26.7382 6.94744 26.766 6.81553 26.7567C6.68362 26.7473 6.55698 26.7011 6.45003 26.6233C6.34308 26.5455 6.26011 26.4393 6.21055 26.3167C6.16098 26.1941 6.14682 26.06 6.16968 25.9298L7.34419 19.0787C7.42177 18.6264 7.38816 18.162 7.24625 17.7256C7.10434 17.2892 6.8584 16.8938 6.52963 16.5737L1.54896 11.725C1.45376 11.633 1.3863 11.5162 1.35427 11.3878C1.32223 11.2594 1.3269 11.1245 1.36775 10.9987C1.4086 10.8728 1.48399 10.7609 1.58532 10.6758C1.68665 10.5906 1.80986 10.5357 1.9409 10.5171L8.82666 9.5106C9.28027 9.44461 9.71106 9.26938 10.0819 8.99998C10.4528 8.73059 10.7527 8.37511 10.9557 7.96414L14.034 1.7263Z"
        fill="white" stroke="white" strokeWidth="2.66631" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="rgba(188,205,232,0.42)" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

export default function ModulesPage() {
  const router = useRouter()
  const [locale,   setLocale]   = useState<Locale>('fr')
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [loading,  setLoading]  = useState(false)
  const [items,    setItems]    = useState<string[]>([])

  useEffect(() => { setLocale(getLocaleFromCookie()) }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('modules')
          .select('name')
          .order('order_index', { ascending: true })
        if (data && data.length > 0) {
          setItems(data.map((m: { name: string }) => m.name))
        } else {
          setItems(translations['fr'].checklistItems.split('|'))
        }
      } catch {
        setItems(translations['fr'].checklistItems.split('|'))
      }
    }
    load()
  }, [])

  const t = translations[locale]

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
      // Silencieux
    }
    router.push('/')
  }

  const guideTitle    = locale === 'en' ? 'Visit Guide'      : 'Guide de visite'
  const guideSubtitle = locale === 'en'
    ? "Explore the stages to discover the Mirokaï universe"
    : "Explorez les étapes pour découvrir l'univers des Mirokaï"

  const totalHeight  = TOP_OFFSET + items.length * SPACING_Y + 64
  const nodeCenterY  = (i: number) => TOP_OFFSET + i * SPACING_Y + NODE_SIZE / 2

  return (
    <>
      <style>{`
        @keyframes nodePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(0,200,255,0.35), 0 0 18px rgba(0,200,255,0.22); }
          50%      { box-shadow: 0 0 0 9px rgba(0,200,255,0),  0 0 28px rgba(0,200,255,0.44); }
        }
        @keyframes starPop {
          from { transform: rotate(-22deg) scale(0.55); opacity: 0; }
          to   { transform: rotate(0deg)  scale(1);    opacity: 1; }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(-3px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes headerIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .et-node { -webkit-tap-highlight-color: transparent; transition: transform 0.12s ease, background 0.25s ease, border-color 0.25s ease; }
        .et-node:active { transform: scale(0.87) !important; }
        .et-node-glow { animation: nodePulse 2.2s ease-in-out infinite; }
        .et-star  { animation: starPop   0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
        .et-tip   { animation: tooltipIn 0.22s cubic-bezier(0.16,1,0.3,1) both; }
        .et-hdr   { animation: headerIn  0.5s  cubic-bezier(0.16,1,0.3,1) 0.06s both; }
        .et-cta {
          -webkit-tap-highlight-color: transparent;
          transition: box-shadow 0.22s ease, transform 0.15s ease, background 0.25s ease;
        }
        .et-cta:not(:disabled):hover  { box-shadow: 0 0 40px rgba(0,200,255,0.5), 0 4px 16px rgba(0,146,247,0.35) !important; }
        .et-cta:not(:disabled):active { transform: scale(0.97); }
        @media (prefers-reduced-motion: reduce) {
          .et-node-glow, .et-star, .et-tip, .et-hdr { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      {/* Fixed background */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', background: 'linear-gradient(180deg, #0D1B35 0%, #1B1042 52%, #0E0820 100%)', inset: 0 }} />
        <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,146,247,0.3) 0%, transparent 62%)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(195,66,150,0.2) 0%, transparent 62%)' }} />
      </div>

      <div
        className={outfit.className}
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100dvh',
          paddingTop:    'max(2.5rem, env(safe-area-inset-top,    0px))',
          paddingBottom: 'max(6rem,   env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* ── Header card ── */}
        <div
          className="et-hdr mx-5 mb-7"
          style={{
            background:       'rgba(255,255,255,0.045)',
            backdropFilter:   'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            border:           '1px solid rgba(255,255,255,0.1)',
            borderRadius:     '22px',
            padding:          '18px 20px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <div style={{
              width: '3px', height: '18px', borderRadius: '2px', flexShrink: 0,
              background: 'linear-gradient(180deg, #00C8FF, #0092F7)',
            }} />
            <h1 style={{
              fontFamily: rajdhani.style.fontFamily,
              fontSize: '17px', fontWeight: 700,
              letterSpacing: '0.07em', color: '#ffffff',
              textTransform: 'uppercase', margin: 0,
            }}>
              {guideTitle}
            </h1>
          </div>
          <p style={{
            fontSize: '12.5px', color: 'rgba(188,205,232,0.55)',
            lineHeight: 1.5, margin: 0, paddingLeft: '13px', textAlign: 'center',
          }}>
            {guideSubtitle}
          </p>
        </div>

        {/* ── Path map ── */}
        {items.length > 0 && (
          <div style={{ position: 'relative', width: '100%', height: `${totalHeight}px` }}>

            {/* Dashed connecting lines */}
            <svg
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
              width="100%" height={totalHeight}
              viewBox={`0 0 100 ${totalHeight}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {items.slice(0, -1).map((_, i) => {
                const x1 = i % 2 === 0 ? LEFT_PCT : RIGHT_PCT
                const x2 = i % 2 === 0 ? RIGHT_PCT : LEFT_PCT
                const y1 = nodeCenterY(i)
                const y2 = nodeCenterY(i + 1)
                const lit = selected.has(i) && selected.has(i + 1)
                return (
                  <line key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={lit ? 'rgba(0,200,255,0.52)' : 'rgba(99,141,200,0.28)'}
                    strokeWidth={lit ? '2.2' : '1.8'}
                    strokeDasharray="7 5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ transition: 'stroke 0.3s ease' }}
                  />
                )
              })}
            </svg>

            {/* Module nodes */}
            {items.map((item, i) => {
              const isLeft = i % 2 === 0
              const isSel  = selected.has(i)
              const topY   = TOP_OFFSET + i * SPACING_Y
              const xPct   = isLeft ? LEFT_PCT : RIGHT_PCT

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={isSel}
                  aria-label={item}
                  className={`et-node${isSel ? ' et-node-glow' : ''}`}
                  style={{
                    position: 'absolute',
                    top:    `${topY}px`,
                    left:   `calc(${xPct}% - ${NODE_SIZE / 2}px)`,
                    width:  `${NODE_SIZE}px`,
                    height: `${NODE_SIZE}px`,
                    borderRadius: '50%',
                    background: isSel
                      ? 'radial-gradient(circle at 38% 38%, rgba(0,220,255,0.28) 0%, rgba(0,146,247,0.14) 55%, rgba(0,100,200,0.06) 100%)'
                      : 'rgba(255,255,255,0.055)',
                    border: `2.5px solid ${isSel ? 'rgba(0,200,255,0.68)' : 'rgba(255,255,255,0.11)'}`,
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'visible',
                    zIndex: 2,
                  }}
                >
                  {/* Icon */}
                  {isSel
                    ? <span key="star" className="et-star"><StarIcon size={26} /></span>
                    : <span key="lock"><LockIcon /></span>
                  }

                  {/* Number badge */}
                  <span style={{
                    position: 'absolute',
                    bottom: '-3px', right: '-3px',
                    width: '22px', height: '22px',
                    borderRadius: '50%',
                    background: isSel ? 'linear-gradient(135deg, #00C8FF, #0092F7)' : 'rgba(22,40,80,0.95)',
                    border: `1.5px solid ${isSel ? 'rgba(0,210,255,0.7)' : 'rgba(255,255,255,0.14)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 700,
                    color: isSel ? '#fff' : 'rgba(188,205,232,0.6)',
                    lineHeight: 1,
                    zIndex: 1,
                  }}>
                    {i + 1}
                  </span>

                  {/* Name tooltip on selection */}
                  {isSel && (
                    <span
                      className="et-tip"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        [isLeft ? 'left' : 'right']: `${NODE_SIZE + 10}px`,
                        background: 'rgba(6,14,38,0.9)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(0,200,255,0.28)',
                        borderRadius: '14px',
                        padding: '8px 13px',
                        fontSize: '12px', fontWeight: 600,
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        maxWidth: '155px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        boxShadow: '0 4px 18px rgba(0,0,0,0.45), 0 0 10px rgba(0,200,255,0.07)',
                        pointerEvents: 'none',
                        zIndex: 10,
                      }}
                    >
                      {item}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Fixed validate button ── */}
      <div
        className="fixed left-0 right-0 z-50"
        style={{
          bottom: 0,
          padding: `12px 20px max(1.5rem, env(safe-area-inset-bottom, 1.5rem))`,
          background: 'linear-gradient(to top, rgba(14,8,32,0.96) 0%, rgba(14,8,32,0.85) 70%, transparent 100%)',
        }}
      >
        <button
          type="button"
          onClick={handleValidate}
          disabled={selected.size === 0 || loading}
          className="et-cta w-full text-white font-semibold text-sm rounded-2xl"
          style={{
            height: '54px',
            background: selected.size > 0
              ? 'linear-gradient(90deg, #00C8FF 0%, #0092F7 100%)'
              : 'rgba(255,255,255,0.07)',
            boxShadow:   selected.size > 0 ? '0 0 28px rgba(0,200,255,0.3), 0 4px 16px rgba(0,146,247,0.22)' : 'none',
            borderWidth: '1px', borderStyle: 'solid',
            borderColor: selected.size > 0 ? 'transparent' : 'rgba(255,255,255,0.1)',
            color:       selected.size > 0 ? '#ffffff' : 'rgba(188,205,232,0.38)',
          }}
        >
          {loading ? '…' : t.checklistValidate}
        </button>
      </div>
    </>
  )
}
