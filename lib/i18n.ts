export const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]

export const translations = {
  fr: {
    title: 'Enchanted Tools',
    subtitle: 'Expérience interactive',
    discover: "Découvrir l'espace",
  },
  en: {
    title: 'Enchanted Tools',
    subtitle: 'Interactive experience',
    discover: 'Discover the space',
  },
} satisfies Record<Locale, Record<string, string>>

export function getLocaleFromCookie(): Locale {
  if (typeof document === 'undefined') return 'fr'
  const match = document.cookie.split('; ').find(row => row.startsWith('locale='))
  const val = match?.split('=')[1]
  return val === 'en' ? 'en' : 'fr'
}

export function setLocaleCookie(locale: Locale) {
  document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`
}
