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
    checklistTitle: 'Que souhaitez-vous visiter ?',
    checklistSubtitle: 'Sélectionnez un ou plusieurs modules',
    checklistValidate: 'Valider ma sélection',
    checklistItems: 'La naissance d\'Enchanted Tools|L\'histoire des Mirokaï|Le design|Électronique sur table|La combinaison des Mirokaï|Pendule inversé|La vision du robot|L\'IA du robot|Cas d\'usage|Salle de cyclage|Fresque récapitulative',
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
    checklistTitle: 'What would you like to visit?',
    checklistSubtitle: 'Select one or more modules',
    checklistValidate: 'Confirm my selection',
    checklistItems: 'The birth of Enchanted Tools|The story of the Mirokaï|Design|Tabletop electronics|The Mirokaï suit|Inverted pendulum|Robot vision|Robot AI|Use cases|Cycling room|Recap fresco',
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
