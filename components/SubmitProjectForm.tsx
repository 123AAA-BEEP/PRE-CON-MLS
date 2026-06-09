'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { submissionFormSchema, type SubmissionFormData } from '@/lib/validation'
import { generateSlug } from '@/lib/slug'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-sm text-red-600 mt-1" role="alert" aria-live="polite">
      {message}
    </p>
  )
}

export default function SubmitProjectForm() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [slugWarning, setSlugWarning] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionFormSchema),
  })

  async function checkSlugUniqueness(slug: string) {
    if (!slug) return
    const supabase = createClient()
    const [{ count: devCount }, { count: pendingCount }] = await Promise.all([
      supabase
        .from('v_public_developments')
        .select('*', { count: 'exact', head: true })
        .eq('slug', slug),
      supabase
        .from('pending_projects')
        .select('*', { count: 'exact', head: true })
        .eq('proposed_slug', slug),
    ])
    if ((devCount ?? 0) > 0 || (pendingCount ?? 0) > 0) {
      setSlugWarning('This slug is already in use. Consider a more specific one.')
    } else {
      setSlugWarning(null)
    }
  }

  function handleNameBlur() {
    const name = getValues('proposed_name')
    if (name && name.length >= 3) {
      const slug = generateSlug(name)
      setValue('proposed_slug', slug, { shouldValidate: true })
      checkSlugUniqueness(slug)
    }
  }

  async function onSubmit(data: SubmissionFormData) {
    setSubmitError(null)

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await res.json()
    if (!res.ok) {
      setSubmitError(result.error ?? 'Submission failed. Please try again.')
      return
    }

    router.push(`/dashboard/submissions?just=${result.id}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* Project name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="proposed_name">Project name *</Label>
        <Input
          id="proposed_name"
          {...register('proposed_name')}
          onBlur={handleNameBlur}
          placeholder="e.g. The Royalton Condos"
        />
        <FieldError message={errors.proposed_name?.message} />
      </div>

      {/* Slug */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="proposed_slug">
          URL slug *{' '}
          <span className="text-slate-400 font-normal">(auto-generated from name)</span>
        </Label>
        <Input
          id="proposed_slug"
          {...register('proposed_slug', {
            onBlur: (e) => checkSlugUniqueness(e.target.value),
          })}
          placeholder="the-royalton-condos"
        />
        <FieldError message={errors.proposed_slug?.message} />
        {slugWarning && (
          <p className="text-sm text-amber-600 mt-1" role="status">
            {slugWarning}
          </p>
        )}
      </div>

      {/* Developer */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="proposed_developer">Developer name</Label>
        <Input
          id="proposed_developer"
          {...register('proposed_developer')}
          placeholder="e.g. Tridel"
        />
        <FieldError message={errors.proposed_developer?.message} />
      </div>

      {/* Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="proposed_address">Street address</Label>
          <Input
            id="proposed_address"
            {...register('proposed_address')}
            placeholder="123 King St W"
          />
          <FieldError message={errors.proposed_address?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="proposed_city">City</Label>
          <Input id="proposed_city" {...register('proposed_city')} placeholder="Toronto" />
          <FieldError message={errors.proposed_city?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="proposed_province">Province</Label>
          <Input id="proposed_province" {...register('proposed_province')} placeholder="ON" />
          <FieldError message={errors.proposed_province?.message} />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="proposed_neighbourhood">Neighbourhood</Label>
          <Input
            id="proposed_neighbourhood"
            {...register('proposed_neighbourhood')}
            placeholder="Entertainment District"
          />
          <FieldError message={errors.proposed_neighbourhood?.message} />
        </div>
      </div>

      {/* Price range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="proposed_price_from">Starting price (CAD)</Label>
          <Input
            id="proposed_price_from"
            type="number"
            min={0}
            {...register('proposed_price_from')}
            placeholder="500000"
          />
          <FieldError message={errors.proposed_price_from?.message} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="proposed_price_to">Highest price (CAD)</Label>
          <Input
            id="proposed_price_to"
            type="number"
            min={0}
            {...register('proposed_price_to')}
            placeholder="1200000"
          />
          <FieldError message={errors.proposed_price_to?.message} />
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="proposed_description">Description</Label>
        <Textarea
          id="proposed_description"
          {...register('proposed_description')}
          rows={5}
          placeholder="Brief overview of the project…"
        />
        <FieldError message={errors.proposed_description?.message} />
      </div>

      {/* Drive folder */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="proposed_drive_folder_url">Google Drive folder URL</Label>
        <Input
          id="proposed_drive_folder_url"
          type="url"
          {...register('proposed_drive_folder_url')}
          placeholder="https://drive.google.com/drive/folders/..."
        />
        <FieldError message={errors.proposed_drive_folder_url?.message} />
      </div>

      {submitError && (
        <p
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3"
          role="alert"
        >
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} size="lg" className="self-start">
        {isSubmitting ? 'Submitting…' : 'Submit project'}
      </Button>
    </form>
  )
}
