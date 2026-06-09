import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { submissionApiSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = submissionApiSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const data = parsed.data

  const { data: inserted, error } = await supabase
    .from('pending_projects')
    .insert({
      submitted_by: user.id,
      proposed_name: data.proposed_name,
      proposed_slug: data.proposed_slug,
      proposed_developer: data.proposed_developer ?? null,
      proposed_address: data.proposed_address ?? null,
      proposed_city: data.proposed_city ?? null,
      proposed_province: data.proposed_province ?? null,
      proposed_neighbourhood: data.proposed_neighbourhood ?? null,
      proposed_price_from: data.proposed_price_from != null ? Number(data.proposed_price_from) : null,
      proposed_price_to: data.proposed_price_to != null ? Number(data.proposed_price_to) : null,
      proposed_description: data.proposed_description ?? null,
      proposed_drive_folder_url: data.proposed_drive_folder_url ?? null,
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: inserted.id }, { status: 201 })
}
