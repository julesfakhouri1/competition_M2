export const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]

export const translations = {
  fr: {
    title: 'Enchanted Tools',
    subtitle: 'Expérience interactive',
    discover: "Découvrir l'espace",
    baseline: 'Robotics Experience',
    heroTitle: 'Bienvenue dans le monde des robots',
    heroDesc: "Découvrez l'univers fascinant de la robotique et de l'intelligence artificielle. Une expérience interactive pour toute la famille.",
    cta: "Commencer l'expérience",
    games: 'Jeux',
    skipLink: 'Aller au contenu principal',
  },
  en: {
    title: 'Enchanted Tools',
    subtitle: 'Interactive experience',
    discover: 'Discover the space',
    baseline: 'Robotics Experience',
    heroTitle: 'Welcome to the world of robots',
    heroDesc: 'Discover the fascinating world of robotics and artificial intelligence. An interactive experience for the whole family.',
    cta: 'Start the experience',
    games: 'Games',
    skipLink: 'Skip to main content',
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
