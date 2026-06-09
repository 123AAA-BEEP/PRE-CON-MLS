import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Brand from '@/components/Brand'
import SignOutButton from './SignOutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar — hidden on mobile, shown as left rail on md+ */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Brand />
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          <Link
            href="/dashboard/submit"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Submit a project
          </Link>
          <Link
            href="/dashboard/submissions"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 transition-colors"
          >
            My submissions
          </Link>
        </nav>
        <div className="px-3 pb-4">
          <SignOutButton />
        </div>
      </aside>

      {/* Mobile top nav */}
      <header className="md:hidden bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4">
        <Brand />
        <div className="flex items-center gap-2">
          <Link href="/dashboard/submit" className="text-sm text-slate-700 px-2 py-1">
            Submit
          </Link>
          <Link href="/dashboard/submissions" className="text-sm text-slate-700 px-2 py-1">
            My submissions
          </Link>
          <SignOutButton />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 md:ml-56">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
