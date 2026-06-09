import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user!.id)
    .maybeSingle()

  const { data: submissions } = await supabase
    .from('pending_projects')
    .select('status')
    .eq('submitted_by', user!.id)

  const counts = {
    total: submissions?.length ?? 0,
    pending: submissions?.filter((s) => s.status === 'pending').length ?? 0,
    approved: submissions?.filter((s) => s.status === 'approved').length ?? 0,
    rejected: submissions?.filter((s) => s.status === 'rejected').length ?? 0,
  }

  const displayName = profile?.display_name ?? user?.email?.split('@')[0] ?? 'Realtor'

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Welcome back, {displayName}.
      </h1>
      <p className="mt-1 text-slate-500 text-sm">Here&apos;s a summary of your submissions.</p>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total" value={counts.total} />
        <StatCard label="Pending" value={counts.pending} badge="warning" />
        <StatCard label="Approved" value={counts.approved} badge="success" />
        <StatCard label="Rejected" value={counts.rejected} badge="destructive" />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  badge,
}: {
  label: string
  value: number
  badge?: 'warning' | 'success' | 'destructive'
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {badge ? (
          <Badge variant={badge} className="text-xs">
            {label}
          </Badge>
        ) : (
          <p className="text-sm text-slate-500">{label}</p>
        )}
      </div>
    </div>
  )
}
