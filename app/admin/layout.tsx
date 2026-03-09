import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-white">Enchanted Tools</span>
          <span className="text-zinc-600 text-sm ml-2">— Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-500 text-xs">{user.email}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
