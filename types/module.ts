export type MediaType = 'audio' | 'video'

export interface Module {
  id: string
  number: number
  name: string
  description: string | null
  media_type: MediaType
  media_url: string | null
  position_x: number
  position_y: number
  order_index: number
  created_at: string
  updated_at: string
}

export interface ModuleImage {
  id: string
  module_id: string
  storage_path: string
  url: string
  order_index: number
}

export type ModuleWithImages = Module & {
  module_images: ModuleImage[]
}

export interface Visitor {
  id: string
  first_name: string
  email: string
  age: string | null
  activities: string[] | null
  created_at: string
}
