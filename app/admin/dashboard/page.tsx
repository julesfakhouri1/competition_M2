import Link from 'next/link'
import { getModules } from '@/lib/actions'
import ModuleList from '@/components/admin/ModuleList'

export default async function DashboardPage() {
  const modules = await getModules()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-semibold text-white">Modules</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(188,205,232,0.55)' }}>
            {modules.length} module{modules.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Link
          href="/admin/dashboard/modules/new"
          className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
          style={{
            background: 'linear-gradient(90deg, #00C8FF 0%, #0092F7 100%)',
            boxShadow: '0 0 20px rgba(0,200,255,0.25)',
          }}
        >
          + Nouveau module
        </Link>
      </div>

      <ModuleList modules={modules} />
    </div>
  )
}
