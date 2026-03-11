'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import type { Module, ModuleWithImages } from '@/types/module'

export async function getModules(): Promise<Module[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('number', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getModule(id: string): Promise<ModuleWithImages | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('modules')
    .select('*, module_images(*)')
    .eq('id', id)
    .order('order_index', { referencedTable: 'module_images', ascending: true })
    .single()
  if (error) return null
  return data
}

export async function createModule(formData: {
  number: number
  name: string
  description: string
  media_type: 'audio' | 'video'
  media_url: string
}): Promise<Module> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('modules')
    .insert({ ...formData, position_x: 0, position_y: 0 })
    .select()
    .single()
  if (error) throw error
  revalidatePath('/admin/dashboard')
  return data
}

export async function updateModule(
  id: string,
  formData: {
    number?: number
    name?: string
    description?: string
    media_type?: 'audio' | 'video'
    media_url?: string
  }
): Promise<Module> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('modules')
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  revalidatePath('/admin/dashboard')
  revalidatePath(`/admin/dashboard/modules/${id}/edit`)
  return data
}

export async function deleteModule(id: string): Promise<void> {
  const supabase = await createClient()
  // Supprimer les images du storage
  const { data: images } = await supabase
    .from('module_images')
    .select('storage_path')
    .eq('module_id', id)
  if (images && images.length > 0) {
    await supabase.storage
      .from('module-images')
      .remove(images.map((img) => img.storage_path))
  }
  const { error } = await supabase.from('modules').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/admin/dashboard')
}

export async function addModuleImage(
  moduleId: string,
  storagePath: string,
  url: string,
  orderIndex: number
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('module_images')
    .insert({ module_id: moduleId, storage_path: storagePath, url, order_index: orderIndex })
    .select()
    .single()
  if (error) throw error
  revalidatePath(`/admin/dashboard/modules/${moduleId}/edit`)
  return data
}

export async function deleteModuleImage(
  imageId: string,
  moduleId: string,
  storagePath: string
): Promise<void> {
  const supabase = await createClient()
  await supabase.storage.from('module-images').remove([storagePath])
  const { error } = await supabase.from('module_images').delete().eq('id', imageId)
  if (error) throw error
  revalidatePath(`/admin/dashboard/modules/${moduleId}/edit`)
}
