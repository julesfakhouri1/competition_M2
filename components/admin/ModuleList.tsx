'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteModule, reorderModules } from '@/lib/actions'
import type { Module } from '@/types/module'

const textMuted = 'rgba(188,205,232,0.55)'
const textSub   = 'rgba(188,205,232,0.75)'
const border    = '1px solid rgba(255,255,255,0.08)'

function DragHandle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: textMuted }}>
      <circle cx="4.5" cy="3" r="1.2" fill="currentColor"/>
      <circle cx="9.5" cy="3" r="1.2" fill="currentColor"/>
      <circle cx="4.5" cy="7" r="1.2" fill="currentColor"/>
      <circle cx="9.5" cy="7" r="1.2" fill="currentColor"/>
      <circle cx="4.5" cy="11" r="1.2" fill="currentColor"/>
      <circle cx="9.5" cy="11" r="1.2" fill="currentColor"/>
    </svg>
  )
}

export default function ModuleList({ modules }: { modules: Module[] }) {
  const router = useRouter()
  const [items,      setItems]      = useState(modules)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId,  setConfirmId]  = useState<string | null>(null)
  const [dragIndex,  setDragIndex]  = useState<number | null>(null)
  const [overIndex,  setOverIndex]  = useState<number | null>(null)
  const [saving,     setSaving]     = useState(false)


  function onDragStart(e: React.DragEvent, i: number) {
    setDragIndex(i)
    e.dataTransfer.effectAllowed = 'move'

    const ghost = document.createElement('div')
    e.dataTransfer.setDragImage(ghost, 0, 0)
  }

  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (i !== overIndex) setOverIndex(i)
  }

  function onDrop(e: React.DragEvent, i: number) {
    e.preventDefault()
    if (dragIndex === null || dragIndex === i) { reset(); return }
    const next = [...items]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(i, 0, moved)
    setItems(next)
    reset()
    persist(next)
  }

  function onDragEnd() { reset() }
  function reset() { setDragIndex(null); setOverIndex(null) }

  async function persist(ordered: Module[]) {
    setSaving(true)
    try {
      await reorderModules(ordered.map((m, idx) => ({ id: m.id, order_index: idx })))
    } finally {
      setSaving(false)
    }
  }

  // ── Suppression ───────────────────────────────────────────────────────────

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteModule(id)
      setItems(prev => prev.filter(m => m.id !== id))
      router.refresh()
    } catch {
      alert('Erreur lors de la suppression.')
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  // ── Rendu vide ────────────────────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="rounded-xl p-12 text-center" style={{ border, background: 'rgba(255,255,255,0.03)' }}>
        <p className="text-sm mb-4" style={{ color: textMuted }}>Aucun module pour l&apos;instant.</p>
        <Link href="/admin/dashboard/modules/new" className="text-sm text-white underline underline-offset-4">
          Créer le premier module
        </Link>
      </div>
    )
  }

  return (
    <div>
      {saving && (
        <p className="text-xs mb-2 text-right" style={{ color: 'rgba(0,200,255,0.6)' }}>
          Sauvegarde…
        </p>
      )}
      <div className="rounded-xl overflow-hidden" style={{ border }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: border, color: textMuted, fontSize: '11px' }} className="uppercase tracking-wider">
              <th className="w-8 px-3 py-3" aria-label="Réordonner" />
              <th className="text-left px-4 py-3 font-medium w-12">#</th>
              <th className="text-left px-4 py-3 font-medium">Nom</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Description</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Média</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((module, i) => {
              const isDragging = dragIndex === i
              const isOver     = overIndex === i && dragIndex !== i
              return (
                <tr
                  key={module.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, i)}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDrop={(e) => onDrop(e, i)}
                  onDragEnd={onDragEnd}
                  style={{
                    borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                    opacity: isDragging ? 0.4 : 1,
                    background: isOver
                      ? 'rgba(0,200,255,0.06)'
                      : 'transparent',
                    borderLeft: isOver ? '2px solid rgba(0,200,255,0.5)' : '2px solid transparent',
                    transition: 'background 0.12s ease, opacity 0.12s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    if (!isDragging && !isOver) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isOver) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {/* Handle */}
                  <td
                    className="px-3 py-3"
                    style={{ cursor: 'grab' }}
                    title="Glisser pour réordonner"
                  >
                    <DragHandle />
                  </td>

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
                      style={module.media_type === 'audio'
                        ? { background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }
                        : { background: 'rgba(0,146,247,0.15)', color: '#60b8ff' }}
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
                          {deletingId === module.id ? '…' : 'Oui'}
                        </button>
                        <button onClick={() => setConfirmId(null)} className="text-xs hover:text-white" style={{ color: textMuted }}>
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
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
