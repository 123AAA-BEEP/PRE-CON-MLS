import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('v_public_developments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(9)

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                Pre-construction projects,<br />all in one place.
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                Livbl helps realtors submit and track pre-construction developments so buyers
                always have access to the most current project information.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild variant="accent" size="lg">
                  <Link href="/sign-in?intent=submit">Submit a project</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/sign-in">Realtor sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Projects grid */}
        {projects && projects.length > 0 ? (
          <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-semibold text-slate-900 mb-8">Current projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 text-center">
            <p className="text-slate-500">No projects published yet. Check back soon.</p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
