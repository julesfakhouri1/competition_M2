'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Outfit, Rajdhani } from 'next/font/google'
import { type Locale, getLocaleFromCookie, translations } from '@/lib/i18n'
import { createClient } from '@/lib/supabase'

type CmsMap = Record<string, { fr: string; en: string }>

const outfit   = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['600', '700'] })

const NODE_SIZE  = 68
const SPACING_Y  = 148
const TOP_OFFSET = 24
const LEFT_PCT   = 20
const RIGHT_PCT  = 75

type Item = { name: string; description: string; media_type?: string; media_url?: string }

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '3px' }}>
      <polygon points="5,3 20,12 5,21"/>
    </svg>
  )
}

function StarIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size * 29 / 30} viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.034 1.7263C14.0924 1.60826 14.1826 1.50891 14.2945 1.43944C14.4064 1.36997 14.5355 1.33316 14.6672 1.33316C14.7989 1.33316 14.928 1.36997 15.0399 1.43944C15.1518 1.50891 15.242 1.60826 15.3005 1.7263L18.3801 7.96414C18.5829 8.37471 18.8824 8.72992 19.2528 8.99927C19.6231 9.26863 20.0533 9.44409 20.5064 9.5106L27.3935 10.5185C27.524 10.5374 27.6466 10.5924 27.7475 10.6774C27.8483 10.7623 27.9234 10.8738 27.9641 10.9992C28.0049 11.1246 28.0098 11.2589 27.9782 11.3869C27.9467 11.515 27.8799 11.6316 27.7855 11.7236L22.8048 16.5737C22.4763 16.8938 22.2306 17.2889 22.0887 17.725C21.9468 18.1612 21.913 18.6252 21.9902 19.0773L23.1661 25.9298C23.1891 26.0602 23.175 26.1945 23.1254 26.3173C23.0758 26.4401 22.9927 26.5465 22.8855 26.6243C22.7784 26.7022 22.6515 26.7483 22.5193 26.7575C22.3872 26.7667 22.2551 26.7386 22.1382 26.6763L15.9817 23.4394C15.5761 23.2264 15.1247 23.1151 14.6666 23.1151C14.2084 23.1151 13.757 23.2264 13.3514 23.4394L7.19621 26.6763C7.07933 26.7382 6.94744 26.766 6.81553 26.7567C6.68362 26.7473 6.55698 26.7011 6.45003 26.6233C6.34308 26.5455 6.26011 26.4393 6.21055 26.3167C6.16098 26.1941 6.14682 26.06 6.16968 25.9298L7.34419 19.0787C7.42177 18.6264 7.38816 18.162 7.24625 17.7256C7.10434 17.2892 6.8584 16.8938 6.52963 16.5737L1.54896 11.725C1.45376 11.633 1.3863 11.5162 1.35427 11.3878C1.32223 11.2594 1.3269 11.1245 1.36775 10.9987C1.4086 10.8728 1.48399 10.7609 1.58532 10.6758C1.68665 10.5906 1.80986 10.5357 1.9409 10.5171L8.82666 9.5106C9.28027 9.44461 9.71106 9.26938 10.0819 8.99998C10.4528 8.73059 10.7527 8.37511 10.9557 7.96414L14.034 1.7263Z" fill="white" stroke="white" strokeWidth="2.66631" strokeLinecap="round" strokeLinejoin="round"/>
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
  const [locale,       setLocale]       = useState<Locale>('fr')
  const [parcoursType, setParcoursType] = useState<'univers' | 'techno'>('univers')
  const [selected, setSelected] = useState<number[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('et_progress')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [items,    setItems]    = useState<Item[]>([])
  const [popup,    setPopup]    = useState<number | null>(null)
  const [completionDismissed, setCompletionDismissed] = useState(false)
  const [cms,      setCms]      = useState<CmsMap>({})
  const [isPlaying,   setIsPlaying]   = useState(false)
  const [audioTime,   setAudioTime]   = useState(0)
  const [audioDur,    setAudioDur]    = useState(0)
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([])
  const topRef   = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setLocale(getLocaleFromCookie())
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('et_parcours') as 'univers' | 'techno' | null
      if (saved) setParcoursType(saved)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) { audio.pause(); audio.currentTime = 0 }
    setIsPlaying(false)
    setAudioTime(0)
    setAudioDur(0)
  }, [popup])

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        const { data: cmsData } = await supabase.from('content').select('key,value_fr,value_en').in('section', ['guide', 'completion'])
        if (cmsData) setCms(Object.fromEntries(cmsData.map((e: { key: string; value_fr: string; value_en: string }) => [e.key, { fr: e.value_fr, en: e.value_en }])))
      } catch {}
    }
    load()
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('modules')
          .select('name, description, media_type, media_url')
          .order('order_index', { ascending: true })
        if (data && data.length > 0) {
          setItems(data.map((m: { name: string; description: string; media_type?: string; media_url?: string }) => ({
            name:        m.name,
            description: m.description ?? '',
            media_type:  m.media_type,
            media_url:   m.media_url,
          })))
        } else {
          setItems(translations['fr'].checklistItems.split('|').map(name => ({ name, description: '' })))
        }
      } catch {
        setItems(translations['fr'].checklistItems.split('|').map(name => ({ name, description: '' })))
      }
    }
    load()
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) { audio.pause(); setIsPlaying(false) }
    else { audio.play(); setIsPlaying(true) }
  }

  function seekAudio(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = (e.clientX - rect.left) / rect.width
    if (audioRef.current && audioDur > 0) {
      audioRef.current.currentTime = pct * audioDur
      setAudioTime(pct * audioDur)
    }
  }

  function selectAndClose(i: number) {
    setSelected(prev => {
      if (prev.includes(i)) return prev
      const next = [...prev, i]
      try { localStorage.setItem('et_progress', JSON.stringify(next)) } catch {}
      return next
    })
    setPopup(null)
    const nextIndex = i + 1
    if (nextIndex < items.length) {
      setTimeout(() => {
        nodeRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 320)
    }
  }

  const c = (key: string, fallback: string) => (locale === 'fr' ? cms[key]?.fr : cms[key]?.en) || fallback

  const parcoursTitle = parcoursType === 'univers'
    ? (locale === 'en' ? 'The Mirokaï Universe' : "L'Univers Mirokaï")
    : (locale === 'en' ? 'The Technology' : 'La Technologie')

  const completedCount = selected.length
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0
  const currentIndex = items.findIndex((_, i) => !selected.includes(i))

  const totalHeight = TOP_OFFSET + items.length * SPACING_Y + 80
  const nodeCenterY = (i: number) => TOP_OFFSET + i * SPACING_Y + NODE_SIZE / 2

  const popupIndex  = popup ?? -1
  const popupItem   = popupIndex >= 0 ? items[popupIndex] : null
  const isCompleted = items.length > 0 && selected.length >= items.length && !completionDismissed

  return (
    <>
      {/* Fixed background */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div style={{ position: 'absolute', background: 'linear-gradient(180deg, #0D1B35 0%, #1B1042 52%, #0E0820 100%)', inset: 0 }} />
        <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,146,247,0.3) 0%, transparent 62%)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(195,66,150,0.2) 0%, transparent 62%)' }} />
      </div>

      <div
        ref={topRef}
        className={outfit.className}
        style={{
          position: 'relative', zIndex: 1,
          minHeight: '100dvh',
          paddingTop:    'max(2.5rem, env(safe-area-inset-top,    0px))',
          paddingBottom: 'max(6rem,   env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* ── Header ── */}
        <div
          className="et-hdr"
          style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '28px' }}
        >
          {/* Back button + titre */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
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
              fontSize: '26px', fontWeight: 700,
              color: '#ffffff', margin: 0, lineHeight: 1,
            }}>
              {parcoursTitle}
            </h1>
          </div>

          {/* Barre de progression */}
          <div style={{ height: '5px', borderRadius: '999px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6B4DFF 0%, #00C8FF 100%)',
              borderRadius: '999px',
              transition: 'width 0.4s ease',
            }} />
          </div>
          <p style={{
            fontSize: '13px', fontWeight: 600,
            color: 'rgba(188,205,232,0.55)',
            textAlign: 'center', margin: 0,
          }}>
            {completedCount} / {items.length} étape{completedCount > 1 ? 's' : ''} complétée{completedCount > 1 ? 's' : ''}
          </p>
        </div>

        {/* ── Path map ── */}
        {items.length > 0 && (
          <div style={{ position: 'relative', width: '100%', height: `${totalHeight}px` }}>

            {/* Connecting lines */}
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
                const lit = selected.includes(i)
                return (
                  <line key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={lit ? 'rgba(0,200,255,0.52)' : 'rgba(99,141,200,0.28)'}
                    strokeWidth={lit ? '2.2' : '1.8'}
                    strokeDasharray={lit ? undefined : '7 5'}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ transition: 'stroke 0.3s ease' }}
                  />
                )
              })}
            </svg>

            {/* Module nodes */}
            {items.map((item, i) => {
              const isLeft   = i % 2 === 0
              const isSel    = selected.includes(i)
              const isActive = i === currentIndex
              const topY     = TOP_OFFSET + i * SPACING_Y
              const xPct     = isLeft ? LEFT_PCT : RIGHT_PCT

              const nodeBackground = isSel
                ? 'linear-gradient(135deg, #4DD9FF 0%, #0092F7 100%)'
                : isActive
                  ? 'linear-gradient(135deg, #E066B8 0%, #8B3677 50%, #6B4DFF 100%)'
                  : 'rgba(255,255,255,0.055)'

              const nodeBorder = isSel
                ? 'rgba(0,200,255,0.68)'
                : isActive
                  ? 'rgba(195,66,150,0.7)'
                  : 'rgba(255,255,255,0.11)'

              const nodeBoxShadow = isActive
                ? '0 0 24px rgba(195,66,150,0.55), 0 0 48px rgba(139,54,119,0.3)'
                : 'none'

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: `${topY}px`,
                    left: `calc(${xPct}% - ${NODE_SIZE / 2}px)`,
                  }}
                >
                  <button
                    ref={el => { nodeRefs.current[i] = el }}
                    type="button"
                    onClick={() => setPopup(i)}
                    aria-label={item.name}
                    className={`et-node${isSel ? ' et-node-glow' : ''}`}
                    style={{
                      width:  `${NODE_SIZE}px`,
                      height: `${NODE_SIZE}px`,
                      borderRadius: '50%',
                      background: nodeBackground,
                      border: `2.5px solid ${nodeBorder}`,
                      backdropFilter: 'blur(14px)',
                      WebkitBackdropFilter: 'blur(14px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', overflow: 'visible', zIndex: 2,
                      boxShadow: nodeBoxShadow,
                    }}
                  >
                    {isSel ? <CheckIcon /> : isActive ? <PlayIcon /> : <LockIcon />}

                    {/* Number badge */}
                    <span style={{
                      position: 'absolute', bottom: '-3px', right: '-3px',
                      width: '22px', height: '22px', borderRadius: '50%',
                        background: '#101425',
                      border: '1.5px solid rgba(255,255,255,0.14)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 700,
                      color: '#fff',
                      lineHeight: 1, zIndex: 1,
                    }}>
                      {i + 1}
                    </span>
                  </button>

                  {/* Label + badge En cours */}
                  <div style={{
                    position: 'absolute',
                    top: `${NODE_SIZE + 8}px`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '110px',
                    textAlign: 'center',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: isSel || isActive ? 600 : 500,
                      color: isSel
                        ? 'rgba(255,255,255,0.9)'
                        : isActive
                          ? '#ffffff'
                          : 'rgba(188,205,232,0.45)',
                      lineHeight: 1.3,
                      display: 'block',
                    }}>
                      {item.name}
                    </span>

                    {isActive && (
                      <span style={{
                        fontSize: '11px', fontWeight: 700,
                        color: '#E066B8',
                        background: 'rgba(195,66,150,0.15)',
                        border: '1px solid rgba(195,66,150,0.35)',
                        borderRadius: '999px',
                        padding: '2px 10px',
                      }}>
                        En cours
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Module popup ── */}
      {popupIndex >= 0 && popupItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mod-title"
          onClick={() => setPopup(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: 'max(3.5rem, env(safe-area-inset-top, 3.5rem))',
            paddingLeft: '16px', paddingRight: '16px',
            background: 'rgba(6,10,28,0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          <div
            className={`et-popup-card ${outfit.className}`}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              background: 'linear-gradient(160deg, rgba(20,35,80,0.99) 0%, rgba(28,18,68,0.99) 100%)',
              border: '1px solid rgba(0,200,255,0.2)',
              borderRadius: '28px',
              padding: '22px 20px 22px',
              boxShadow: '0 24px 64px rgba(0,0,0,0.65), 0 0 0 0.5px rgba(0,200,255,0.08)',
            }}
          >
            {/* Header: badge + titre + close */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                flexShrink: 0,
                width: '70px', height: '70px', borderRadius: '18px',
                background: 'linear-gradient(135deg, #4DD9FF 0%, #00AAFF 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontWeight: 800, color: '#ffffff',
                boxShadow: '0 4px 20px rgba(0,200,255,0.4)',
              }}>
                {popupIndex + 1}
              </div>

              <h2
                id="mod-title"
                style={{ flex: 1, fontSize: '22px', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, margin: 0, paddingTop: '4px' }}
              >
                {popupItem.name}
              </h2>

              <button
                onClick={() => setPopup(null)}
                aria-label="Fermer"
                style={{
                  flexShrink: 0,
                  width: '42px', height: '42px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(255,255,255,0.8)',
                  fontSize: '20px', lineHeight: 1,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                ×
              </button>
            </div>

            {/* Contenu : audio player ou description */}
            {popupItem.media_type === 'audio' && popupItem.media_url ? (
              <div style={{ marginBottom: '22px' }}>
                <audio
                  ref={audioRef}
                  src={popupItem.media_url}
                  onTimeUpdate={() => setAudioTime(audioRef.current?.currentTime ?? 0)}
                  onLoadedMetadata={() => setAudioDur(audioRef.current?.duration ?? 0)}
                  onEnded={() => setIsPlaying(false)}
                />
                <p style={{ fontSize: '14px', color: 'rgba(188,205,232,0.7)', textAlign: 'center', margin: '0 0 18px' }}>
                  Appuyez sur le bouton pour écouter l&apos;audio
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Lecture'}
                    style={{
                      flexShrink: 0,
                      width: '58px', height: '58px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6B4DFF 0%, #00C8FF 100%)',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 22px rgba(107,77,255,0.45)',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'transform 0.12s ease, box-shadow 0.18s ease',
                    }}
                  >
                    {isPlaying ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <rect x="6" y="4" width="4" height="16" rx="1.5"/>
                        <rect x="14" y="4" width="4" height="16" rx="1.5"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '3px' }}>
                        <polygon points="5,3 20,12 5,21"/>
                      </svg>
                    )}
                  </button>
                  <div
                    onClick={seekAudio}
                    style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.14)', cursor: 'pointer', overflow: 'hidden' }}
                  >
                    <div style={{
                      width: `${audioDur > 0 ? (audioTime / audioDur) * 100 : 0}%`,
                      height: '100%',
                      background: 'rgba(255,255,255,0.75)',
                      borderRadius: '4px',
                      transition: 'width 0.1s linear',
                    }} />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.055)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: '18px',
                padding: '18px',
                marginBottom: '22px',
                minHeight: '80px',
              }}>
                <p style={{ fontSize: '16px', color: 'rgba(210,225,250,0.88)', lineHeight: 1.65, margin: 0 }}>
                  {popupItem.description || "Enchanted Tools allie imagination et technologie pour créer des personnages qui rapprochent l'humain et la machine, ouvrant la voie à une robotique plus sensible et expressive."}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => selectAndClose(popupIndex)}
              className="et-read-btn"
              style={{
                width: '100%', height: '58px', borderRadius: '999px',
                background: '#8B3677',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                fontSize: '17px', fontWeight: 700, color: '#ffffff',
                boxShadow: '0 0 28px rgba(139,54,119,0.45), 0 4px 16px rgba(139,54,119,0.3)',
              }}
            >
              {popupItem.media_type === 'audio' && popupItem.media_url ? "J'ai terminé l'étape ✓" : "J'ai lu ✓"}
            </button>
          </div>
        </div>
      )}

      {/* ── Page fin de parcours ── */}
      {isCompleted && (
        <div
          role="dialog"
          aria-modal="true"
          className={`et-completion ${outfit.className}`}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            display: 'flex', flexDirection: 'column',
            background: 'linear-gradient(180deg, #0D1B35 0%, #1B1042 52%, #0E0820 100%)',
            paddingTop:    'max(2.5rem, env(safe-area-inset-top,    0px))',
            paddingBottom: 'max(2rem,   env(safe-area-inset-bottom, 0px))',
            paddingLeft:   'max(1.25rem, env(safe-area-inset-left,  0px))',
            paddingRight:  'max(1.25rem, env(safe-area-inset-right, 0px))',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <button
              onClick={() => setCompletionDismissed(true)}
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
              Fin de parcours
            </span>
          </div>

          {/* Contenu centré */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px' }}>
            {/* Icône étoile */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6B4DFF 0%, #8B3677 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 32px rgba(107,77,255,0.5)',
              marginBottom: '8px',
            }}>
              <StarIcon size={34} />
            </div>

            <h2 style={{ fontFamily: '"AcuminVariable", sans-serif', fontSize: '28px', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.15 }}>
              Parcours terminé !
            </h2>

            <p style={{ fontSize: '15px', color: 'rgba(188,205,232,0.7)', lineHeight: 1.55, margin: 0, maxWidth: '280px' }}>
              {`Vous avez complété les ${items.length} étapes du parcours ${parcoursType === 'univers' ? "de l'Univers Mirokaï" : 'de la Technologie'}.`}
            </p>

            <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '8px 0 0' }}>
              Que voulez-vous faire maintenant ?
            </p>
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="button"
              onClick={() => router.push('/parcours')}
              style={{
                width: '100%', height: '56px', borderRadius: '999px',
                background: '#8B3677',
                border: 'none', cursor: 'pointer',
                fontSize: '16px', fontWeight: 700, color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 0 28px rgba(139,54,119,0.45), 0 4px 16px rgba(139,54,119,0.3)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {parcoursType === 'univers' ? 'Découvrir la Technologie' : "Découvrir l'Univers Mirokaï"} →
            </button>

            <button
              type="button"
              onClick={() => {
                setSelected([])
                try { localStorage.removeItem('et_progress') } catch {}
                setCompletionDismissed(true)
                setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
              }}
              style={{
                width: '100%', height: '56px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.18)',
                cursor: 'pointer',
                fontSize: '16px', fontWeight: 600,
                color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              Refaire le parcours
            </button>

            <button
              type="button"
              onClick={() => router.push('/avis')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '15px', fontWeight: 600,
                color: '#8B3677',
                padding: '8px',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              Terminer le parcours
            </button>
          </div>
        </div>
      )}
    </>
  )
}
