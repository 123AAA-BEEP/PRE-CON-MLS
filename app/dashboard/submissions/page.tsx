import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import SubmissionDetail from './SubmissionDetail'

const statusVariants = {
  pending: 'warning',
  approved: 'success',
  rejected: 'destructive',
} as const

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ just?: string }>
}) {
  const { just } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: submissions } = await supabase
    .from('pending_projects')
    .select('*')
    .eq('submitted_by', user!.id)
    .order('submitted_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">My submissions</h1>

      {just && (
        <div className="mb-6 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          Project submitted successfully. We&apos;ll review it shortly.
        </div>
      )}

      {!submissions || submissions.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No submissions yet.{' '}
          <a href="/dashboard/submit" className="text-slate-900 underline underline-offset-2">
            Submit your first project →
          </a>
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">Project</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">
                  City
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">
                  Submitted
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600 sr-only">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{sub.proposed_name}</p>
                    <p className="text-xs text-slate-400">{sub.proposed_slug}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
                    {sub.proposed_city ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariants[sub.status as keyof typeof statusVariants] ?? 'secondary'}>
                      {sub.status}
                    </Badge>
                    {sub.status === 'rejected' && sub.rejection_reason && (
                      <p className="text-xs text-red-600 mt-1">{sub.rejection_reason}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                    {new Date(sub.submitted_at).toLocaleDateString('en-CA')}
                  </td>
                  <td className="px-4 py-3">
                    <SubmissionDetail submission={sub} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
