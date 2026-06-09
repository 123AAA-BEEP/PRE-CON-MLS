import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const userId = data.user.id
      const email = data.user.email ?? ''

      // Create profiles row if it doesn't exist
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (!existingProfile) {
        const displayName = email.split('@')[0]
        await supabase.from('profiles').insert({
          id: userId,
          role: 'realtor',
          display_name: displayName,
        })
        await supabase.from('realtor_profiles').insert({
          user_id: userId,
          email,
        })
      }

      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?error=auth`)
}
