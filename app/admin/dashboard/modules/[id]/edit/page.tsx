import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getModule } from '@/lib/actions'
import ModuleForm from '@/components/admin/ModuleForm'

interface EditModulePageProps {
  params: Promise<{ id: string }>
}

export default async function EditModulePage({ params }: EditModulePageProps) {
  const { id } = await params
  const module = await getModule(id)
  if (!module) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/dashboard"
          className="text-sm transition-colors hover:text-white"
          style={{ color: 'rgba(188,205,232,0.5)' }}
        >
          ← Retour
        </Link>
        <h1 className="text-lg font-semibold text-white mt-3">
          Modifier — {module.name}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(188,205,232,0.45)' }}>
          Module n°{module.number}
        </p>
      </div>
      <ModuleForm module={module} />
    </div>
  )
}
