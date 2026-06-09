import { Badge } from './ui/badge'
import { formatCurrency } from '@/lib/utils'
import type { Database } from '@/lib/supabase/types'

type Development = Database['public']['Views']['v_public_developments']['Row']

const statusLabels: Record<string, string> = {
  registration: 'Registration Open',
  selling: 'Now Selling',
  sold_out: 'Sold Out',
  coming_soon: 'Coming Soon',
  complete: 'Complete',
}

const statusVariants: Record<
  string,
  'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'
> = {
  registration: 'warning',
  selling: 'success',
  sold_out: 'destructive',
  coming_soon: 'secondary',
  complete: 'outline',
}

export default function ProjectCard({ project }: { project: Development }) {
  const priceRange =
    project.price_from && project.price_to
      ? `${formatCurrency(project.price_from)} – ${formatCurrency(project.price_to)}`
      : project.price_from
        ? `From ${formatCurrency(project.price_from)}`
        : null

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col gap-3 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900 text-lg leading-tight">{project.name}</h3>
        {project.listing_status && (
          <Badge variant={statusVariants[project.listing_status] ?? 'secondary'}>
            {statusLabels[project.listing_status] ?? project.listing_status}
          </Badge>
        )}
      </div>

      {(project.neighbourhood || project.city) && (
        <p className="text-sm text-slate-500">
          {[project.neighbourhood, project.city].filter(Boolean).join(', ')}
        </p>
      )}

      {project.developer_name && (
        <p className="text-xs text-slate-400">{project.developer_name}</p>
      )}

      {project.headline && (
        <p className="text-sm text-slate-600 line-clamp-2">{project.headline}</p>
      )}

      {priceRange && (
        <p className="text-sm font-medium text-slate-800 mt-auto pt-2">{priceRange}</p>
      )}
    </article>
  )
}
