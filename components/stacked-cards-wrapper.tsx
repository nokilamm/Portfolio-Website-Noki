'use client'

import dynamic from 'next/dynamic'
import type { CaseStudy } from '@/lib/utils'

const StackedCardsClient = dynamic(
  () => import('./stacked-cards-client'),
  { ssr: false }
)

export default function StackedCardsWrapper({ caseStudies }: { caseStudies: CaseStudy[] }) {
  return <StackedCardsClient caseStudies={caseStudies} />
}
