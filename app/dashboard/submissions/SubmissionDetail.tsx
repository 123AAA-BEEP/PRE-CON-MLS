'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'

type Submission = Database['public']['Tables']['pending_projects']['Row']

const statusVariants = {
  pending: 'warning',
  approved: 'success',
  rejected: 'destructive',
} as const

function Row({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (!value) return null
  return (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-slate-100 last:border-0">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="col-span-2 text-sm text-slate-900 break-words">{String(value)}</dd>
    </div>
  )
}

export default function SubmissionDetail({ submission: s }: { submission: Submission }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="sm">
          View
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-slate-900">
                {s.proposed_name}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-500 mt-0.5">
                {s.proposed_slug}
              </Dialog.Description>
            </div>
            <Badge
              variant={statusVariants[s.status as keyof typeof statusVariants] ?? 'secondary'}
            >
              {s.status}
            </Badge>
          </div>

          <dl>
            <Row label="Developer" value={s.proposed_developer} />
            <Row label="Address" value={s.proposed_address} />
            <Row label="City" value={s.proposed_city} />
            <Row label="Province" value={s.proposed_province} />
            <Row label="Neighbourhood" value={s.proposed_neighbourhood} />
            <Row
              label="Price range"
              value={
                s.proposed_price_from || s.proposed_price_to
                  ? `${formatCurrency(s.proposed_price_from)} – ${formatCurrency(s.proposed_price_to)}`
                  : null
              }
            />
            <Row label="Description" value={s.proposed_description} />
            <Row label="Drive folder" value={s.proposed_drive_folder_url} />
            <Row
              label="Submitted"
              value={new Date(s.submitted_at).toLocaleString('en-CA')}
            />
            {s.rejection_reason && (
              <Row label="Rejection reason" value={s.rejection_reason} />
            )}
          </dl>

          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <Button variant="outline">Close</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
