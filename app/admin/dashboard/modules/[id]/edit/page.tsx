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
    <div>
      <div className="mb-8">
        <Link
          href="/admin/dashboard"
          className="text-zinc-500 hover:text-white text-sm transition-colors"
        >
          ← Retour
        </Link>
        <h1 className="text-lg font-semibold text-white mt-3">
          Modifier — {module.name}
        </h1>
        <p className="text-zinc-500 text-sm mt-0.5">Module n°{module.number}</p>
      </div>

      <ModuleForm module={module} />
    </div>
  )
}
