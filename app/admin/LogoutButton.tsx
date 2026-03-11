'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs transition-colors"
      style={{ color: 'rgba(188,205,232,0.5)' }}
      onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(188,205,232,0.5)'}
    >
      Déconnexion
    </button>
  )
}
