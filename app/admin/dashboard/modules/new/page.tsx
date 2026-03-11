import Link from 'next/link'
import ModuleForm from '@/components/admin/ModuleForm'

export default function NewModulePage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/dashboard"
          className="text-zinc-500 hover:text-white text-sm transition-colors"
        >
          ← Retour
        </Link>
        <h1 className="text-lg font-semibold text-white mt-3">Nouveau module</h1>
      </div>

      <ModuleForm />
    </div>
  )
}
