import Link from 'next/link'
import ModuleForm from '@/components/admin/ModuleForm'

export default function NewModulePage() {
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
        <h1 className="text-lg font-semibold text-white mt-3">Nouveau module</h1>
      </div>
      <ModuleForm />
    </div>
  )
}
