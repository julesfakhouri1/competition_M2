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
          <p className="text-zinc-500 text-sm mt-0.5">
            {modules.length} module{modules.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Link
          href="/admin/dashboard/modules/new"
          className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          + Nouveau module
        </Link>
      </div>

      <ModuleList modules={modules} />
    </div>
  )
}
