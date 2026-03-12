'use client'

import { useState, useEffect } from 'react'
import LangSwitcher from '@/components/LangSwitcher'
import { type Locale, translations, getLocaleFromCookie } from '@/lib/i18n'

export default function LocaleProvider() {
  const [locale, setLocale] = useState<Locale>('fr')

  useEffect(() => {
    setLocale(getLocaleFromCookie())
  }, [])

  const t = translations[locale]

  return (
    <>
      <div className="fixed top-6 right-6 z-50">
        <LangSwitcher locale={locale} onLocaleChange={setLocale} />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-3xl font-semibold tracking-wide">{t.title}</h1>
        <p className="text-zinc-400 text-sm">{t.subtitle}</p>
      </div>
    </>
  )
}
