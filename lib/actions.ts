'use server'

/**
 * SQL à exécuter dans Supabase avant d'utiliser ce fichier :
 *
 * -- Colonne d'ordre pour les modules
 * ALTER TABLE modules ADD COLUMN order_index integer DEFAULT 0;
 * UPDATE modules SET order_index = number;
 *
 * -- Table visiteurs
 * CREATE TABLE visitors (
 *   id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
 *   first_name text NOT NULL,
 *   email text NOT NULL,
 *   age text,
 *   activities text[],
 *   created_at timestamptz DEFAULT now()
 * );
 * ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
 * CREATE POLICY "insert_visitor" ON visitors FOR INSERT WITH CHECK (true);
 * CREATE POLICY "select_visitor" ON visitors FOR SELECT USING (auth.role() = 'authenticated');
 */

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import type { Module, ModuleWithImages, Visitor } from '@/types/module'

// ── Modules ────────────────────────────────────────────────────────────────

export async function getModules(): Promise<Module[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('order_index', { ascending: true })
  if (error) {
    // Fallback si la colonne order_index n'existe pas encore
    const { data: fallback, error: err2 } = await supabase
      .from('modules')
      .select('*')
      .order('number', { ascending: true })
    if (err2) throw err2
    return fallback ?? []
  }
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
  const { count } = await supabase.from('modules').select('*', { count: 'exact', head: true })
  const { data, error } = await supabase
    .from('modules')
    .insert({ ...formData, position_x: 0, position_y: 0, order_index: (count ?? 0) })
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
  const { data: images } = await supabase
    .from('module_images')
    .select('storage_path')
    .eq('module_id', id)
  if (images && images.length > 0) {
    await supabase.storage.from('module-images').remove(images.map((img) => img.storage_path))
  }
  const { error } = await supabase.from('modules').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/admin/dashboard')
}

export async function reorderModules(
  order: { id: string; order_index: number }[]
): Promise<void> {
  const supabase = await createClient()
  await Promise.all(
    order.map(({ id, order_index }) =>
      supabase.from('modules').update({ order_index }).eq('id', id)
    )
  )
  revalidatePath('/admin/dashboard')
}

// ── Images modules ─────────────────────────────────────────────────────────

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

// ── Visiteurs ──────────────────────────────────────────────────────────────

export async function saveVisitor(data: {
  first_name: string
  email: string
  age: string
  activities: string[]
}): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('visitors').insert(data)
  if (error) throw error
}

export async function getVisitors(): Promise<Visitor[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
