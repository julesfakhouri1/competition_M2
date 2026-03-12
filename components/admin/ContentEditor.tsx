'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { updateContentEntry } from '@/lib/actions'
import type { ContentEntry } from '@/types/module'

const inputStyle  = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' } as React.CSSProperties
const focusStyle  = { borderColor: 'rgba(0,200,255,0.5)' }
const blurStyle   = { borderColor: 'rgba(255,255,255,0.1)' }
const labelColor  = 'rgba(188,205,232,0.7)'
const mutedColor  = 'rgba(188,205,232,0.45)'

const SECTION_LABELS: Record<string, string> = {
  home:       'Page d\'accueil',
  parcours:   'Choix du parcours',
  guide:      'Guide de visite',
  completion: 'Message de fin',
}

const KEY_LABELS: Record<string, string> = {
  hero_title:      'Titre principal',
  hero_desc:       'Description',
  hero_cta:        'Bouton CTA',
  hero_baseline:   'Baseline',
  parcours_title:  'Titre de la page',
  parcours_note:   'Note de bas de page',
  card1_label:     'Card 1 — Label',
  card1_title:     'Card 1 — Titre',
  card1_subtitle:  'Card 1 — Sous-titre',
  card1_image_url: 'Card 1 — Image',
  card2_label:     'Card 2 — Label',
  card2_title:     'Card 2 — Titre',
  card2_subtitle:  'Card 2 — Sous-titre',
  card2_image_url: 'Card 2 — Image',
  guide_title:     'Titre',
  guide_subtitle:  'Sous-titre',
  completion_title:'Titre',
  completion_desc: 'Description',
}

interface Props { entries: ContentEntry[] }

export default function ContentEditor({ entries }: Props) {
  const [values, setValues] = useState<Record<string, { fr: string; en: string }>>(
    Object.fromEntries(entries.map(e => [e.key, { fr: e.value_fr, en: e.value_en }]))
  )
  const [saving,    setSaving]    = useState<string | null>(null)
  const [saved,     setSaved]     = useState<string | null>(null)
  const [error,     setError]     = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)
  const imageRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const sections = [...new Set(entries.map(e => e.section))]

  async function handleSave(key: string) {
    setSaving(key); setError(null)
    try {
      await updateContentEntry(key, { value_fr: values[key].fr, value_en: values[key].en })
      setSaved(key)
      setTimeout(() => setSaved(null), 2000)
    } catch {
      setError(`Erreur lors de la sauvegarde de "${key}"`)
    } finally {
      setSaving(null)
    }
  }

  async function handleImageUpload(key: string, file: File) {
    setUploading(key); setError(null)
    try {
      const supabase = createClient()
      const ext  = file.name.split('.').pop()
      const path = `parcours/${key}_${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('module-images').upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('module-images').getPublicUrl(path)
      const url = data.publicUrl
      setValues(prev => ({ ...prev, [key]: { fr: url, en: url } }))
      await updateContentEntry(key, { value_fr: url, value_en: url })
      setSaved(key)
      setTimeout(() => setSaved(null), 2000)
    } catch {
      setError("Erreur lors de l'upload de l'image.")
    } finally {
      setUploading(null)
    }
  }

  const isImageKey = (key: string) => key.endsWith('_image_url')

  return (
    <div className="space-y-10 max-w-2xl">
      {error && (
        <div className="text-sm rounded-xl px-4 py-3" style={{ border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)', color: '#fca5a5' }}>
          {error}
        </div>
      )}

      {sections.map(section => (
        <section key={section}>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: mutedColor }}>
            {SECTION_LABELS[section] ?? section}
          </h2>

          <div className="space-y-5">
            {entries.filter(e => e.section === section).map(entry => (
              <div key={entry.key} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs font-medium mb-3" style={{ color: labelColor }}>
                  {KEY_LABELS[entry.key] ?? entry.key}
                </p>

                {isImageKey(entry.key) ? (
                  <div className="space-y-3">
                    {values[entry.key]?.fr && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={values[entry.key].fr} alt="" className="h-28 rounded-lg object-cover" style={{ border: '1px solid rgba(255,255,255,0.1)' }} />
                    )}
                    <input
                      ref={el => { imageRefs.current[entry.key] = el }}
                      type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(entry.key, f) }}
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={uploading === entry.key}
                        onClick={() => imageRefs.current[entry.key]?.click()}
                        className="text-xs rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                        style={{ color: labelColor, border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {uploading === entry.key ? 'Upload en cours…' : 'Changer l\'image'}
                      </button>
                      {saved === entry.key && <span className="text-xs" style={{ color: 'rgba(0,200,255,0.8)' }}>✓ Enregistré</span>}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs mb-1" style={{ color: mutedColor }}>Français</p>
                        <textarea
                          rows={2}
                          value={values[entry.key]?.fr ?? ''}
                          onChange={e => setValues(prev => ({ ...prev, [entry.key]: { ...prev[entry.key], fr: e.target.value } }))}
                          className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors resize-none"
                          style={inputStyle}
                          onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
                          onBlur={e  => Object.assign(e.currentTarget.style, blurStyle)}
                        />
                      </div>
                      <div>
                        <p className="text-xs mb-1" style={{ color: mutedColor }}>English</p>
                        <textarea
                          rows={2}
                          value={values[entry.key]?.en ?? ''}
                          onChange={e => setValues(prev => ({ ...prev, [entry.key]: { ...prev[entry.key], en: e.target.value } }))}
                          className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors resize-none"
                          style={inputStyle}
                          onFocus={e => Object.assign(e.currentTarget.style, focusStyle)}
                          onBlur={e  => Object.assign(e.currentTarget.style, blurStyle)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={saving === entry.key}
                        onClick={() => handleSave(entry.key)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity disabled:opacity-50"
                        style={{ background: 'linear-gradient(90deg, #00C8FF 0%, #0092F7 100%)' }}
                      >
                        {saving === entry.key ? 'Enregistrement…' : 'Enregistrer'}
                      </button>
                      {saved === entry.key && <span className="text-xs" style={{ color: 'rgba(0,200,255,0.8)' }}>✓ Enregistré</span>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
