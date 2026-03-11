'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteModule } from '@/lib/actions'
import type { Module } from '@/types/module'

interface ModuleListProps {
  modules: Module[]
}

const border = '1px solid rgba(255,255,255,0.08)'
const textMuted = 'rgba(188,205,232,0.55)'
const textSub   = 'rgba(188,205,232,0.75)'

export default function ModuleList({ modules }: ModuleListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteModule(id)
      router.refresh()
    } catch {
      alert('Erreur lors de la suppression.')
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  if (modules.length === 0) {
    return (
      <div
        className="rounded-xl p-12 text-center"
        style={{ border, background: 'rgba(255,255,255,0.03)' }}
      >
        <p className="text-sm mb-4" style={{ color: textMuted }}>
          Aucun module pour l&apos;instant.
        </p>
        <Link
          href="/admin/dashboard/modules/new"
          className="text-sm text-white underline underline-offset-4"
        >
          Créer le premier module
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: border, color: textMuted, fontSize: '11px' }} className="uppercase tracking-wider">
            <th className="text-left px-4 py-3 font-medium w-12">#</th>
            <th className="text-left px-4 py-3 font-medium">Nom</th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Description</th>
            <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Média</th>
            <th className="text-right px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((module, i) => (
            <tr
              key={module.id}
              className="transition-colors"
              style={{
                borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <td className="px-4 py-3 font-mono text-xs" style={{ color: textMuted }}>
                {module.number}
              </td>
              <td className="px-4 py-3 font-medium text-white">{module.name}</td>
              <td className="px-4 py-3 hidden md:table-cell max-w-xs truncate" style={{ color: textSub }}>
                {module.description ?? <span style={{ color: textMuted, fontStyle: 'italic' }}>—</span>}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
                  style={
                    module.media_type === 'audio'
                      ? { background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }
                      : { background: 'rgba(0,146,247,0.15)', color: '#60b8ff' }
                  }
                >
                  {module.media_type === 'audio' ? '🎵' : '🎬'} {module.media_type}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                {confirmId === module.id ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="text-xs" style={{ color: textMuted }}>Supprimer ?</span>
                    <button
                      onClick={() => handleDelete(module.id)}
                      disabled={deletingId === module.id}
                      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      {deletingId === module.id ? 'Suppression…' : 'Oui'}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs hover:text-white"
                      style={{ color: textMuted }}
                    >
                      Non
                    </button>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-3">
                    <Link
                      href={`/admin/dashboard/modules/${module.id}/edit`}
                      className="text-xs hover:text-white transition-colors"
                      style={{ color: textSub }}
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => setConfirmId(module.id)}
                      className="text-xs hover:text-red-400 transition-colors"
                      style={{ color: textMuted }}
                    >
                      Supprimer
                    </button>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
