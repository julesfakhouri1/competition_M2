'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteModule } from '@/lib/actions'
import type { Module } from '@/types/module'

interface ModuleListProps {
  modules: Module[]
}

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
      <div className="border border-zinc-800 rounded-lg p-12 text-center">
        <p className="text-zinc-500 text-sm">Aucun module pour l&apos;instant.</p>
        <Link
          href="/admin/dashboard/modules/new"
          className="mt-4 inline-block text-sm text-white underline underline-offset-4"
        >
          Créer le premier module
        </Link>
      </div>
    )
  }

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
            <th className="text-left px-4 py-3 font-medium w-12">#</th>
            <th className="text-left px-4 py-3 font-medium">Nom</th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Description</th>
            <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Média</th>
            <th className="text-right px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900">
          {modules.map((module) => (
            <tr key={module.id} className="hover:bg-zinc-950 transition-colors">
              <td className="px-4 py-3 text-zinc-400 font-mono">{module.number}</td>
              <td className="px-4 py-3 font-medium text-white">{module.name}</td>
              <td className="px-4 py-3 text-zinc-400 hidden md:table-cell max-w-xs truncate">
                {module.description ?? <span className="text-zinc-600 italic">—</span>}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                    module.media_type === 'audio'
                      ? 'bg-violet-950 text-violet-300'
                      : 'bg-blue-950 text-blue-300'
                  }`}
                >
                  {module.media_type === 'audio' ? '🎵' : '🎬'} {module.media_type}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                {confirmId === module.id ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="text-zinc-400 text-xs">Supprimer ?</span>
                    <button
                      onClick={() => handleDelete(module.id)}
                      disabled={deletingId === module.id}
                      className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                    >
                      {deletingId === module.id ? 'Suppression…' : 'Oui'}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs text-zinc-500 hover:text-zinc-300"
                    >
                      Non
                    </button>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-3">
                    <Link
                      href={`/admin/dashboard/modules/${module.id}/edit`}
                      className="text-zinc-400 hover:text-white transition-colors text-xs"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => setConfirmId(module.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors text-xs"
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
