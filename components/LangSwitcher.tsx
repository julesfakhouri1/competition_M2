'use client'

import { useState, useRef, useEffect } from 'react'
import { type Locale, setLocaleCookie } from '@/lib/i18n'

const other: Record<Locale, Locale> = { fr: 'en', en: 'fr' }

export default function LangSwitcher({ locale, onLocaleChange }: {
  locale: Locale
  onLocaleChange: (l: Locale) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  function switchLang() {
    const next = other[locale]
    setLocaleCookie(next)
    onLocaleChange(next)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 cursor-pointer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/flag-${locale}.svg`} alt={locale} width={20} height={20} />
        <span className="text-white text-xs tracking-[0.2em] uppercase font-light">{locale}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/chevron.svg"
          alt=""
          width={12}
          height={12}
          className={`invert transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full mt-3 right-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/flag-${other[locale]}.svg`}
            alt={other[locale]}
            width={20}
            height={20}
            className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={switchLang}
          />
        </div>
      )}
    </div>
  )
}
