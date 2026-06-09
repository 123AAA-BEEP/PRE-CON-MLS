import SubmitProjectForm from '@/components/SubmitProjectForm'

export default function SubmitPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">Submit a project</h1>
      <p className="mt-1 text-slate-500 text-sm mb-8">
        Fill in the details below. Our team will review your submission and publish it once
        approved.
      </p>
      <SubmitProjectForm />
    </div>
  )
}
