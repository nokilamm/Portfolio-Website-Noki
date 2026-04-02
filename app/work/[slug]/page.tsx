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
    <main style={{ background: '#141414', minHeight: '100vh', color: '#fff' }}>

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
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Back
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '12vh', paddingBottom: '6vh', paddingLeft: '4vw', paddingRight: '4vw', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Glass panel 1 — tags + title + description */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.14)',
          background: 'rgba(12,12,12,0.82)',
          backdropFilter: 'blur(10px) saturate(140%) brightness(0.9)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3), inset 1px 0 0 rgba(255,255,255,0.04)',
          padding: '2rem 2.25rem 2.25rem',
          overflow: 'hidden',
        }}>
          {/* Upper gloss */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 100%)', borderRadius: '20px 20px 0 0', pointerEvents: 'none' }} />
          {/* Top specular line */}
          <div style={{ position: 'absolute', top: '1px', left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0.3) 60%, transparent)', pointerEvents: 'none' }} />
          {/* Left edge catch light */}
          <div style={{ position: 'absolute', top: '8%', left: '1px', width: '1px', bottom: '20%', background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {data.tags && data.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {data.tags.map((tag: string) => (
                  <span key={tag} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 style={{ fontFamily: 'var(--font-rinter)', fontStyle: 'normal', fontWeight: 400, fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.02em', lineHeight: 1.05, color: 'rgba(255,255,255,0.92)', marginBottom: '1.25rem', textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
              {data.title}
            </h1>

            {data.description && (
              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300, fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '600px', margin: 0 }}>
                {data.description}
              </p>
            )}
          </div>
        </div>

        {/* Glass panel 2 — client / year / role */}
        {(data.client || data.year || data.role) && (
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(12,12,12,0.82)',
            backdropFilter: 'blur(10px) saturate(140%) brightness(0.9)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3), inset 1px 0 0 rgba(255,255,255,0.04)',
            padding: '1.75rem 2.25rem',
            overflow: 'hidden',
          }}>
            {/* Top specular line */}
            <div style={{ position: 'absolute', top: '1px', left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.25) 60%, transparent)', pointerEvents: 'none' }} />
            {/* Left edge catch light */}
            <div style={{ position: 'absolute', top: '15%', left: '1px', width: '1px', bottom: '15%', background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
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
          </div>
        )}
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
                  <h2 style={{ fontFamily: 'var(--font-rinter)', fontStyle: 'normal', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.01em', marginTop: '3rem', marginBottom: '1rem' }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '-0.01em', marginTop: '2rem', marginBottom: '0.75rem' }}>
                    {children}
                  </h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote style={{ borderLeft: '2px solid rgba(255,255,255,0.15)', paddingLeft: '1.5rem', margin: '2rem 0', fontFamily: 'var(--font-rinter)', fontStyle: 'normal', color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', lineHeight: 1.7 }}>
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
