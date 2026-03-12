'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Outfit } from 'next/font/google'
import LangSwitcher from '@/components/LangSwitcher'
import { type Locale, getLocaleFromCookie, translations } from '@/lib/i18n'
import { createClient } from '@/lib/supabase'

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] })

export default function LandingPage() {
  const router = useRouter()
  const [locale, setLocale] = useState<Locale>('fr')
  const [cms, setCms] = useState<Record<string, { fr: string; en: string }>>({})

  useEffect(() => { setLocale(getLocaleFromCookie()) }, [])
  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('content').select('key,value_fr,value_en').eq('section', 'home')
        if (data) setCms(Object.fromEntries(data.map((e: { key: string; value_fr: string; value_en: string }) => [e.key, { fr: e.value_fr, en: e.value_en }])))
      } catch {}
    }
    load()
  }, [])

  const t = translations[locale]
  const c = (key: string, fallback: string) => (locale === 'fr' ? cms[key]?.fr : cms[key]?.en) || fallback

  return (
    <main
      className={`${outfit.className} relative flex flex-col`}
      style={{ height: '100dvh', background: 'linear-gradient(180deg, #0D1B35 0%, #1B1042 52%, #0E0820 100%)' }}
    >
      <a href="#et-content" className="et-skip">{t.skipLink}</a>

      <div className="fixed top-6 right-6 z-50">
        <LangSwitcher locale={locale} onLocaleChange={setLocale} />
      </div>

      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div style={{ position: 'absolute', top: '-90px', left: '-70px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,146,247,0.35) 0%, transparent 62%)' }} />
        <div style={{ position: 'absolute', top: '-70px', right: '-70px', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,40,220,0.28) 0%, transparent 62%)' }} />
      </div>

      {/* Bloc texte — shrink 0, centré */}
      <div
        id="et-content"
        className="relative z-10 flex flex-col items-center text-center w-full"
        style={{
          flexShrink: 0,
          paddingTop:   'max(2.5rem, env(safe-area-inset-top,    0px))',
          paddingLeft:  'max(1.5rem, env(safe-area-inset-left,   0px))',
          paddingRight: 'max(1.5rem, env(safe-area-inset-right,  0px))',
          gap: '16px',
        }}
      >
        <div className="flex flex-col items-center gap-2.5">
          <Image src="/enchanted_tools.svg" alt="Logo Enchanted Tools" width={28} height={32} priority />
          <Image src="/mirokai_experience_logo.svg" alt="Mirokaï Experience" width={140} height={38} priority />
        </div>

        <h1
          id="et-hero-title"
          style={{ fontSize: 'clamp(28px, 8vw, 36px)', fontWeight: 900, color: '#ffffff', lineHeight: 1.12, margin: 0 }}
        >
          {c('hero_title', t.heroTitle)}
        </h1>

        <p style={{ fontSize: '15px', color: 'rgba(178,196,228,0.88)', lineHeight: 1.65, margin: 0 }}>
          {t.heroDesc}
        </p>
      </div>

      {/* Personnages — prend tout l'espace restant */}
      <div
        className="relative z-10 flex-1 w-full flex items-end justify-center overflow-hidden"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/characters_hero.svg"
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* Bouton */}
      <div
        className="relative z-10 w-full"
        style={{
          flexShrink: 0,
          paddingBottom: 'max(2rem,   env(safe-area-inset-bottom, 0px))',
          paddingLeft:   'max(1.5rem, env(safe-area-inset-left,   0px))',
          paddingRight:  'max(1.5rem, env(safe-area-inset-right,  0px))',
          paddingTop: '0px',
        }}
      >
        <button
          type="button"
          className="et-btn-primary w-full"
          onClick={() => router.push('/experience')}
          style={{
            minHeight: '56px',
            borderRadius: '999px',
            background: '#8B3677',
            boxShadow: '0 0 32px rgba(139,54,119,0.5), 0 4px 20px rgba(139,54,119,0.35)',
            color: '#ffffff', fontSize: '17px', fontWeight: 700,
            fontFamily: 'inherit', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          {c('hero_cta', t.cta)} <span aria-hidden="true">→</span>
        </button>
      </div>
    </main>
  )
}
