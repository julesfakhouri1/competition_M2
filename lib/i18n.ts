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
    formFirstName: 'Prénom',
    formEmail: 'Email',
    formAge: 'Âge',
    formSubmit: "Entrer dans l'expérience",
    formPrivacy: 'Vos données sont sécurisées et confidentielles',
    formErrorRequired: 'Veuillez remplir tous les champs.',
    formErrorEmail: 'Veuillez entrer une adresse email valide.',
    checklistTitle: 'Que souhaitez-vous faire ?',
    checklistSubtitle: 'Choisissez une ou plusieurs activités',
    checklistValidate: 'Valider ma sélection',
    checklistItems: 'Serrer la main|Prendre une photo ensemble|Avoir une conversation|Danser avec Mirokaï|Jouer à un jeu',
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
    formFirstName: 'First name',
    formEmail: 'Email',
    formAge: 'Age',
    formSubmit: 'Enter the experience',
    formPrivacy: 'Your data is secure and confidential',
    formErrorRequired: 'Please fill in all fields.',
    formErrorEmail: 'Please enter a valid email address.',
    checklistTitle: 'What would you like to do?',
    checklistSubtitle: 'Choose one or more activities',
    checklistValidate: 'Confirm my selection',
    checklistItems: 'Shake hands|Take a photo together|Have a conversation|Dance with Mirokaï|Play a game',
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
