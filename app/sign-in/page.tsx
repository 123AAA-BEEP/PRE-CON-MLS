'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Brand from '@/components/Brand'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const intent = searchParams.get('intent')
  const hasError = searchParams.get('error') === 'auth'

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const origin = window.location.origin

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="mb-8 flex justify-center">
          <Brand />
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-slate-900 font-medium">Check your email</p>
            <p className="mt-2 text-sm text-slate-500">
              We sent a sign-in link to <strong>{email}</strong>. Click it to continue.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-slate-900 mb-1">
              {intent === 'submit' ? 'Sign in to submit a project' : 'Realtor sign in'}
            </h1>
            <p className="text-sm text-slate-500 mb-6">
              Enter your email and we&apos;ll send you a sign-in link.
            </p>

            {hasError && (
              <p
                className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2"
                role="alert"
              >
                Sign-in failed. Please try again.
              </p>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-1.5 mb-4">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="mb-3 text-sm text-red-600" role="alert" aria-live="polite">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading || !email}>
                {loading ? 'Sending…' : 'Send sign-in link'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
