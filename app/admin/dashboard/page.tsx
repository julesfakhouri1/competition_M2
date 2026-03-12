import Link from 'next/link'
import { getModules, getVisitors } from '@/lib/actions'
import ModuleList from '@/components/admin/ModuleList'
import type { Visitor } from '@/types/module'

const textMuted = 'rgba(188,205,232,0.55)'
const border    = '1px solid rgba(255,255,255,0.08)'

function VisitorRow({ v }: { v: Visitor }) {
  const date = new Date(v.created_at).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
  })
  return (
    <tr style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <td className="px-4 py-3 text-white font-medium">{v.first_name}</td>
      <td className="px-4 py-3 hidden sm:table-cell" style={{ color: textMuted }}>{v.email}</td>
      <td className="px-4 py-3 hidden md:table-cell" style={{ color: textMuted }}>{v.age ?? '—'}</td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {v.activities?.map((a) => (
            <span key={a} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,200,255,0.1)', color: '#60d8ff' }}>
              {a}
            </span>
          )) ?? <span style={{ color: textMuted }}>—</span>}
        </div>
      </td>
      <td className="px-4 py-3 text-xs hidden xl:table-cell" style={{ color: textMuted }}>{date}</td>
    </tr>
  )
}

export default async function DashboardPage() {
  const [modules, visitors] = await Promise.all([getModules(), getVisitors()])

  return (
    <div className="space-y-12">

      {/* ── Modules ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">Modules</h2>
            <p className="text-sm mt-0.5" style={{ color: textMuted }}>
              {modules.length} module{modules.length !== 1 ? 's' : ''} · glisser pour réordonner
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
      </section>

      {/* ── Visiteurs ── */}
      <section>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-white">Visiteurs</h2>
          <p className="text-sm mt-0.5" style={{ color: textMuted }}>
            {visitors.length} visiteur{visitors.length !== 1 ? 's' : ''} enregistré{visitors.length !== 1 ? 's' : ''}
          </p>
        </div>

        {visitors.length === 0 ? (
          <div className="rounded-xl p-12 text-center" style={{ border, background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-sm" style={{ color: textMuted }}>Aucun visiteur pour l&apos;instant.</p>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: border, color: textMuted, fontSize: '11px' }} className="uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Prénom</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Âge</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Activités choisies</th>
                  <th className="text-left px-4 py-3 font-medium hidden xl:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => <VisitorRow key={v.id} v={v} />)}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  )
}
