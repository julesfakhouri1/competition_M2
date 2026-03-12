import Link from 'next/link'
import { getContent } from '@/lib/actions'
import ContentEditor from '@/components/admin/ContentEditor'

export default async function ContentPage() {
  const entries = await getContent()

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/dashboard"
          className="text-xs transition-colors hover:text-white"
          style={{ color: 'rgba(188,205,232,0.5)' }}
        >
          ← Retour au tableau de bord
        </Link>
        <h1 className="text-lg font-semibold text-white mt-3">Contenu éditorial</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(188,205,232,0.5)' }}>
          Textes affichés dans l&apos;application
        </p>
      </div>
      <ContentEditor entries={entries} />
    </div>
  )
}
