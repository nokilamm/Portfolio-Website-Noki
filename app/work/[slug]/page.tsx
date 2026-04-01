import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { CASE_STUDY_QUERY, CASE_STUDY_SLUGS_QUERY } from '@/sanity/lib/queries'
import { SanityImage } from '@/components/sanity-image'
import { PortableText } from 'next-sanity'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: CASE_STUDY_SLUGS_QUERY,
    stega: false,
    perspective: 'published',
  })
  return (data ?? []).map((item: { slug: string }) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await sanityFetch({ query: CASE_STUDY_QUERY, params: { slug }, stega: false })
  if (!data) return { title: 'Not Found' }
  return {
    title: `${data.title} — Portfolio`,
    description: data.description ?? '',
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const { data } = await sanityFetch({ query: CASE_STUDY_QUERY, params: { slug } })

  if (!data) notFound()

  return (
    <main style={{ background: '#1c0808', minHeight: '100vh', color: '#fff' }}>
      {/* Back nav */}
      <nav style={{ padding: '2rem 4vw', position: 'fixed', top: 0, left: 0, zIndex: 10 }}>
        <Link
          href="/"
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'color 0.2s ease',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Back
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '12vh', paddingBottom: '6vh', paddingLeft: '4vw', paddingRight: '4vw', maxWidth: '900px', margin: '0 auto' }}>

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {data.tags.map((tag: string) => (
              <span key={tag} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.03em', lineHeight: 1.05, color: 'rgba(255,255,255,0.92)', marginBottom: '1.5rem' }}>
          {data.title}
        </h1>

        {data.description && (
          <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300, fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '600px', marginBottom: '2.5rem' }}>
            {data.description}
          </p>
        )}

        {/* Meta row */}
        <div style={{ display: 'flex', gap: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {data.client && (
            <div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.4rem' }}>Client</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>{data.client}</p>
            </div>
          )}
          {data.year && (
            <div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.4rem' }}>Year</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>{data.year}</p>
            </div>
          )}
          {data.role && (
            <div>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.4rem' }}>Role</p>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>{data.role}</p>
            </div>
          )}
        </div>
      </section>

      {/* Cover image */}
      {data.coverImage?.asset && (
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto 6vh', padding: '0 4vw' }}>
          <div style={{ borderRadius: '18px', overflow: 'hidden', position: 'relative', aspectRatio: '16/9' }}>
            <SanityImage
              value={data.coverImage}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Body content */}
      {data.content && (
        <article style={{ maxWidth: '720px', margin: '0 auto', padding: '0 4vw 12vh' }}>
          <PortableText
            value={data.content as Parameters<typeof PortableText>[0]['value']}
            components={{
              block: {
                normal: ({ children }) => (
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300, fontSize: '1.05rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    {children}
                  </p>
                ),
                h2: ({ children }) => (
                  <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', marginTop: '3rem', marginBottom: '1rem' }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '-0.01em', marginTop: '2rem', marginBottom: '0.75rem' }}>
                    {children}
                  </h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote style={{ borderLeft: '2px solid rgba(255,255,255,0.15)', paddingLeft: '1.5rem', margin: '2rem 0', fontFamily: 'Playfair Display', fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', lineHeight: 1.7 }}>
                    {children}
                  </blockquote>
                ),
              },
              types: {
                image: ({ value }) => (
                  <figure style={{ margin: '3rem 0' }}>
                    <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
                      <SanityImage value={value} width={720} />
                    </div>
                    {value.caption && (
                      <figcaption style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.75rem', textAlign: 'center' }}>
                        {value.caption}
                      </figcaption>
                    )}
                  </figure>
                ),
              },
              marks: {
                strong: ({ children }) => <strong style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{children}</strong>,
                em: ({ children }) => <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.75)' }}>{children}</em>,
                link: ({ children, value }) => (
                  <a href={value?.href} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
                    {children}
                  </a>
                ),
              },
            }}
          />
        </article>
      )}
    </main>
  )
}
