'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { createModule, updateModule, addModuleImage, deleteModuleImage } from '@/lib/actions'
import type { ModuleWithImages, MediaType } from '@/types/module'

interface ModuleFormProps {
  module?: ModuleWithImages
}

export default function ModuleForm({ module }: ModuleFormProps) {
  const router = useRouter()
  const isEdit = !!module

  const [number, setNumber] = useState(module?.number?.toString() ?? '')
  const [name, setName] = useState(module?.name ?? '')
  const [description, setDescription] = useState(module?.description ?? '')
  const [mediaType, setMediaType] = useState<MediaType>(module?.media_type ?? 'audio')
  const [mediaUrl, setMediaUrl] = useState(module?.media_url ?? '')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Upload média
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  // Upload images
  const [uploadingImage, setUploadingImage] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState(module?.module_images ?? [])
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)

  async function handleMediaUpload(file: File) {
    setUploadingMedia(true)
    setError(null)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('module-media')
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('module-media').getPublicUrl(path)
      setMediaUrl(data.publicUrl)
    } catch (e) {
      setError('Erreur lors de l\'upload du média.')
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
      const ext = file.name.split('.').pop()
      const path = `${module.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('module-images')
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('module-images').getPublicUrl(path)
      const newImage = await addModuleImage(module.id, path, data.publicUrl, images.length)
      setImages((prev) => [...prev, newImage])
    } catch (e) {
      setError('Erreur lors de l\'upload de l\'image.')
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
      setError('Erreur lors de la suppression de l\'image.')
    } finally {
      setDeletingImageId(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!number || !name) {
      setError('Le numéro et le nom sont obligatoires.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        number: parseInt(number, 10),
        name,
        description,
        media_type: mediaType,
        media_url: mediaUrl,
      }

      if (isEdit && module) {
        await updateModule(module.id, payload)
      } else {
        await createModule(payload)
      }
      router.push('/admin/dashboard')
      router.refresh()
    } catch (e) {
      setError('Une erreur est survenue. Vérifiez les données et réessayez.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="border border-red-800 bg-red-950 text-red-300 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Infos générales */}
      <section>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Informations générales
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-[96px_1fr] gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Numéro</label>
              <input
                type="number"
                min="1"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                placeholder="Nom du module"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
              placeholder="Description du module (optionnel)"
            />
          </div>
        </div>
      </section>

      {/* Média */}
      <section>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Média principal
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Type</label>
            <div className="flex gap-2">
              {(['audio', 'video'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMediaType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    mediaType === type
                      ? 'bg-white text-black'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {type === 'audio' ? '🎵 Audio' : '🎬 Vidéo'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Fichier média</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors font-mono text-xs"
                placeholder="URL du média ou uploader ci-dessous"
              />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <input
                ref={mediaInputRef}
                type="file"
                accept={mediaType === 'audio' ? 'audio/*' : 'video/*'}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleMediaUpload(file)
                }}
              />
              <button
                type="button"
                disabled={uploadingMedia}
                onClick={() => mediaInputRef.current?.click()}
                className="text-xs text-zinc-400 hover:text-white border border-zinc-800 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                {uploadingMedia ? 'Upload en cours…' : `Uploader un ${mediaType === 'audio' ? 'fichier audio' : 'fichier vidéo'}`}
              </button>
              {mediaUrl && (
                <span className="text-xs text-zinc-600 truncate max-w-xs">
                  ✓ Fichier défini
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Images — uniquement en édition */}
      {isEdit && (
        <section>
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Images du module
          </h2>

          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {images.map((img) => (
                <div key={img.id} className="relative group aspect-video rounded-lg overflow-hidden bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    disabled={deletingImageId === img.id}
                    onClick={() => handleDeleteImage(img.id, img.storage_path)}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400 disabled:opacity-50"
                  >
                    {deletingImageId === img.id ? 'Suppression…' : 'Supprimer'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 text-sm mb-4">Aucune image.</p>
          )}

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(file)
            }}
          />
          <button
            type="button"
            disabled={uploadingImage}
            onClick={() => imageInputRef.current?.click()}
            className="text-xs text-zinc-400 hover:text-white border border-zinc-800 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
          >
            {uploadingImage ? 'Upload en cours…' : '+ Ajouter une image'}
          </button>
          <p className="text-zinc-600 text-xs mt-2">
            Les images sont disponibles après la création du module.
          </p>
        </section>
      )}

      {!isEdit && (
        <p className="text-zinc-600 text-xs">
          Vous pourrez ajouter des images après la création du module.
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-white text-black text-sm font-medium px-5 py-2 rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-50"
        >
          {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer les modifications' : 'Créer le module'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/dashboard')}
          className="text-sm text-zinc-500 hover:text-white transition-colors px-3 py-2"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}
