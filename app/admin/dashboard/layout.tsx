import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import LogoutButton from '../LogoutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin')

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: 'linear-gradient(180deg, #0D1B35 0%, #111830 100%)' }}
    >
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <Image src="/logo_1.svg" alt="" width={28} height={28} aria-hidden="true" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white tracking-wide">Enchanted Tools</span>
            <span className="text-xs font-normal" style={{ color: 'rgba(188,205,232,0.45)' }}>
              — Admin
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs hidden sm:block" style={{ color: 'rgba(188,205,232,0.5)' }}>
            {user.email}
          </span>
          <LogoutButton />
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
