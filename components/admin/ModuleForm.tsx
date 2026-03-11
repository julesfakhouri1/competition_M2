'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { createModule, updateModule, addModuleImage, deleteModuleImage } from '@/lib/actions'
import type { ModuleWithImages, MediaType } from '@/types/module'

interface ModuleFormProps {
  module?: ModuleWithImages
}

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
} as React.CSSProperties

const inputFocusStyle = { borderColor: 'rgba(0,200,255,0.5)' }
const inputBlurStyle  = { borderColor: 'rgba(255,255,255,0.1)' }
const labelColor      = 'rgba(188,205,232,0.7)'
const sectionTitle    = 'rgba(188,205,232,0.45)'

export default function ModuleForm({ module }: ModuleFormProps) {
  const router  = useRouter()
  const isEdit  = !!module

  const [number,      setNumber]      = useState(module?.number?.toString() ?? '')
  const [name,        setName]        = useState(module?.name ?? '')
  const [description, setDescription] = useState(module?.description ?? '')
  const [mediaType,   setMediaType]   = useState<MediaType>(module?.media_type ?? 'audio')
  const [mediaUrl,    setMediaUrl]    = useState(module?.media_url ?? '')
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  const [uploadingMedia, setUploadingMedia] = useState(false)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  const [uploadingImage,  setUploadingImage]  = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [images,          setImages]          = useState(module?.module_images ?? [])
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)

  async function handleMediaUpload(file: File) {
    setUploadingMedia(true)
    setError(null)
    try {
      const supabase = createClient()
      const ext  = file.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('module-media').upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('module-media').getPublicUrl(path)
      setMediaUrl(data.publicUrl)
    } catch {
      setError("Erreur lors de l'upload du média.")
    } finally {
      setUploadingMedia(false)
    }
  }

  async function handleImageUpload(file: File) {
    if (!module?.id) return
    setUploadingImage(true)
    setError(null)
    try {
      const supabase = createClient()
      const ext  = file.name.split('.').pop()
      const path = `${module.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('module-images').upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('module-images').getPublicUrl(path)
      const newImage = await addModuleImage(module.id, path, data.publicUrl, images.length)
      setImages((prev) => [...prev, newImage])
    } catch {
      setError("Erreur lors de l'upload de l'image.")
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleDeleteImage(imageId: string, storagePath: string) {
    if (!module?.id) return
    setDeletingImageId(imageId)
    try {
      await deleteModuleImage(imageId, module.id, storagePath)
      setImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch {
      setError("Erreur lors de la suppression de l'image.")
    } finally {
      setDeletingImageId(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!number || !name) { setError('Le numéro et le nom sont obligatoires.'); return }
    setSaving(true)
    try {
      const payload = { number: parseInt(number, 10), name, description, media_type: mediaType, media_url: mediaUrl }
      if (isEdit && module) await updateModule(module.id, payload)
      else await createModule(payload)
      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Une erreur est survenue. Vérifiez les données et réessayez.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div
          className="text-sm rounded-xl px-4 py-3"
          style={{ border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.08)', color: '#fca5a5' }}
        >
          {error}
        </div>
      )}

      {/* Infos générales */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: sectionTitle }}>
          Informations générales
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-[96px_1fr] gap-4">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: labelColor }}>Numéro</label>
              <input
                type="number" min="1" value={number} onChange={(e) => setNumber(e.target.value)} required
                placeholder="1"
                className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                onBlur={(e)  => Object.assign(e.currentTarget.style, inputBlurStyle)}
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: labelColor }}>Nom</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)} required
                placeholder="Nom du module"
                className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                onBlur={(e)  => Object.assign(e.currentTarget.style, inputBlurStyle)}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: labelColor }}>Description</label>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              placeholder="Description du module (optionnel)"
              className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors resize-none"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
              onBlur={(e)  => Object.assign(e.currentTarget.style, inputBlurStyle)}
            />
          </div>
        </div>
      </section>

      {/* Média */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: sectionTitle }}>
          Média principal
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: labelColor }}>Type</label>
            <div className="flex gap-2">
              {(['audio', 'video'] as const).map((type) => (
                <button
                  key={type} type="button" onClick={() => setMediaType(type)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={mediaType === type
                    ? { background: 'linear-gradient(90deg,#00C8FF,#0092F7)', color: '#fff', border: '1px solid transparent' }
                    : { background: 'rgba(255,255,255,0.05)', color: labelColor, border: '1px solid rgba(255,255,255,0.1)' }
                  }
                >
                  {type === 'audio' ? '🎵 Audio' : '🎬 Vidéo'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: labelColor }}>Fichier média</label>
            <input
              type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="URL du média ou uploader ci-dessous"
              className="w-full rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none transition-colors"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
              onBlur={(e)  => Object.assign(e.currentTarget.style, inputBlurStyle)}
            />
            <div className="mt-2 flex items-center gap-3">
              <input
                ref={mediaInputRef} type="file" accept={mediaType === 'audio' ? 'audio/*' : 'video/*'}
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMediaUpload(f) }}
              />
              <button
                type="button" disabled={uploadingMedia} onClick={() => mediaInputRef.current?.click()}
                className="text-xs rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                style={{ color: labelColor, border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {uploadingMedia ? 'Upload en cours…' : `Uploader un ${mediaType === 'audio' ? 'fichier audio' : 'fichier vidéo'}`}
              </button>
              {mediaUrl && (
                <span className="text-xs" style={{ color: 'rgba(0,200,255,0.7)' }}>✓ Fichier défini</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Images */}
      {isEdit && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: sectionTitle }}>
            Images du module
          </h2>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="relative group aspect-video rounded-lg overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button" disabled={deletingImageId === img.id}
                    onClick={() => handleDeleteImage(img.id, img.storage_path)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400 disabled:opacity-50"
                    style={{ background: 'rgba(0,0,0,0.6)' }}
                  >
                    {deletingImageId === img.id ? 'Suppression…' : 'Supprimer'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm mb-4" style={{ color: sectionTitle }}>Aucune image.</p>
          )}
          <input
            ref={imageInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }}
          />
          <button
            type="button" disabled={uploadingImage} onClick={() => imageInputRef.current?.click()}
            className="text-xs rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
            style={{ color: labelColor, border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {uploadingImage ? 'Upload en cours…' : '+ Ajouter une image'}
          </button>
        </section>
      )}

      {!isEdit && (
        <p className="text-xs" style={{ color: sectionTitle }}>
          Vous pourrez ajouter des images après la création du module.
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit" disabled={saving}
          className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-opacity disabled:opacity-50"
          style={{
            background: 'linear-gradient(90deg, #00C8FF 0%, #0092F7 100%)',
            boxShadow: '0 0 20px rgba(0,200,255,0.25)',
          }}
        >
          {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer les modifications' : 'Créer le module'}
        </button>
        <button
          type="button" onClick={() => router.push('/admin/dashboard')}
          className="text-sm px-3 py-2 transition-colors hover:text-white"
          style={{ color: labelColor }}
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
