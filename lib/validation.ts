import { z } from 'zod'

// Form schema — prices kept as strings for input compatibility
export const submissionFormSchema = z
  .object({
    proposed_name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(120, 'Name must be at most 120 characters'),
    proposed_slug: z
      .string()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be lowercase kebab-case (e.g. my-project)'),
    proposed_developer: z.string().optional(),
    proposed_address: z.string().optional(),
    proposed_city: z.string().optional(),
    proposed_province: z.string().optional(),
    proposed_neighbourhood: z.string().optional(),
    proposed_price_from: z.string().optional(),
    proposed_price_to: z.string().optional(),
    proposed_description: z.string().max(4000, 'Max 4000 characters').optional(),
    proposed_drive_folder_url: z
      .string()
      .refine(
        (v) => !v || v.startsWith('https://drive.google.com/'),
        'Must be a Google Drive URL'
      )
      .optional(),
  })
  .refine(
    (data) => {
      const from = data.proposed_price_from ? Number(data.proposed_price_from) : undefined
      const to = data.proposed_price_to ? Number(data.proposed_price_to) : undefined
      if (from != null && to != null) return from <= to
      return true
    },
    { message: 'Price from must be ≤ price to', path: ['proposed_price_to'] }
  )

export type SubmissionFormData = z.infer<typeof submissionFormSchema>

// API schema — server-side validation with proper number types
export const submissionApiSchema = z
  .object({
    proposed_name: z.string().min(3).max(120),
    proposed_slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    proposed_developer: z.string().optional().nullable(),
    proposed_address: z.string().optional().nullable(),
    proposed_city: z.string().optional().nullable(),
    proposed_province: z.string().optional().nullable(),
    proposed_neighbourhood: z.string().optional().nullable(),
    proposed_price_from: z.union([z.number().positive(), z.string().transform(Number)]).optional().nullable(),
    proposed_price_to: z.union([z.number().positive(), z.string().transform(Number)]).optional().nullable(),
    proposed_description: z.string().max(4000).optional().nullable(),
    proposed_drive_folder_url: z
      .string()
      .refine((v) => !v || v.startsWith('https://drive.google.com/'))
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.proposed_price_from != null && data.proposed_price_to != null) {
        return Number(data.proposed_price_from) <= Number(data.proposed_price_to)
      }
      return true
    },
    { message: 'Price from must be ≤ price to', path: ['proposed_price_to'] }
  )

export type SubmissionApiData = z.infer<typeof submissionApiSchema>
