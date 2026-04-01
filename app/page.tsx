import { sanityFetch } from '@/sanity/lib/live'
import { CASE_STUDIES_QUERY } from '@/sanity/lib/queries'
import { GlassCards } from '@/components/ui/glass-cards'

export default async function HomePage() {
  const { data: caseStudies } = await sanityFetch({ query: CASE_STUDIES_QUERY })

  return (
    <main>
      <GlassCards caseStudies={caseStudies ?? []} />
    </main>
  )
}
