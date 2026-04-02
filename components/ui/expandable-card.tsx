'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import type { CaseStudy } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ExpandableCardProps {
  caseStudy: CaseStudy
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function ExpandableCard({ caseStudy, children, className, style }: ExpandableCardProps) {
  const [active, setActive] = React.useState(false)
  const cardRef = React.useRef<HTMLDivElement>(null)
  const id = React.useId()

  const imageUrl = caseStudy.coverImage?.asset?.url
  const title = caseStudy.client || caseStudy.title

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(false)
    }
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setActive(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  // Lock body scroll when expanded
  React.useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [active])

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(16px)' }}
          />
        )}
      </AnimatePresence>

      {/* Expanded overlay */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-8">
            <motion.div
              layoutId={`card-${title}-${id}`}
              ref={cardRef}
              style={{
                width: '100%',
                maxWidth: '720px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(12,12,12,0.97)',
                backdropFilter: 'blur(24px) saturate(140%)',
                boxShadow: '0 48px 96px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Top specular line */}
              <div style={{ position: 'absolute', top: '1px', left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0.3) 60%, transparent)', pointerEvents: 'none', zIndex: 10 }} />

              {/* Cover image */}
              {imageUrl && (
                <motion.div layoutId={`image-${title}-${id}`} style={{ flexShrink: 0, position: 'relative' }}>
                  <img
                    src={imageUrl}
                    alt={caseStudy.coverImage?.alt || title}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      display: 'block',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(12,12,12,0.97) 100%)',
                    pointerEvents: 'none',
                  }} />
                </motion.div>
              )}

              {/* Close button */}
              <motion.button
                layoutId={`button-${title}-${id}`}
                aria-label="Close"
                onClick={() => setActive(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  zIndex: 20,
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(0,0,0,0.55)',
                  backdropFilter: 'blur(8px)',
                  color: 'rgba(255,255,255,0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6l-12 12" /><path d="M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Content area */}
              <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column' }}>
                {/* Title block */}
                <div style={{ padding: imageUrl ? '1.25rem 2rem 0' : '2.5rem 2rem 0' }}>
                  {caseStudy.tags && caseStudy.tags.length > 0 && (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}
                    >
                      {caseStudy.tags.map((tag) => (
                        <span key={tag} style={{ fontSize: '0.65rem', fontFamily: 'Outfit, sans-serif', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.65rem', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.45)' }}>
                          {tag}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  <motion.h3
                    layoutId={`title-${title}-${id}`}
                    style={{ fontFamily: 'var(--font-rinter)', fontStyle: 'normal', fontWeight: 400, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: caseStudy.description ? '0.75rem' : 0, textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
                  >
                    {title}
                  </motion.h3>

                  {caseStudy.description && (
                    <motion.p
                      layoutId={`description-${caseStudy._id}-${id}`}
                      style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300, fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '560px' }}
                    >
                      {caseStudy.description}
                    </motion.p>
                  )}
                </div>

                {/* Metadata row */}
                {(caseStudy.client || caseStudy.year || caseStudy.role) && (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ margin: '1.5rem 2rem 0', padding: '1.25rem 1.5rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', display: 'flex', gap: '2.5rem', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}
                  >
                    <div style={{ position: 'absolute', top: '1px', left: '8%', right: '8%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 50%, transparent)', pointerEvents: 'none' }} />
                    {caseStudy.client && (
                      <div>
                        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.3rem' }}>Client</p>
                        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}>{caseStudy.client}</p>
                      </div>
                    )}
                    {caseStudy.year && (
                      <div>
                        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.3rem' }}>Year</p>
                        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}>{caseStudy.year}</p>
                      </div>
                    )}
                    {caseStudy.role && (
                      <div>
                        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.3rem' }}>Role</p>
                        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)' }}>{caseStudy.role}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* CTA */}
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ padding: '1.5rem 2rem 2rem' }}
                >
                  <Link
                    href={`/work/${caseStudy.slug}`}
                    onClick={() => setActive(false)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      color: 'rgba(255,255,255,0.8)',
                      padding: '0.7rem 1.4rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.18)',
                      background: 'rgba(255,255,255,0.08)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                      textDecoration: 'none',
                    }}
                  >
                    View Case Study
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Collapsed card (passed-through children — the actual glass card visual) */}
      <motion.div
        layoutId={`card-${title}-${id}`}
        onClick={() => setActive(true)}
        role="button"
        aria-label={`Expand ${title}`}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActive(true) }}
        className={cn('cursor-pointer', className)}
        style={{ position: 'relative', width: '100%', height: '100%', ...style }}
      >
        {/* Image layoutId anchor (invisible, just for layout animation origin) */}
        {imageUrl && (
          <motion.div layoutId={`image-${title}-${id}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }} />
        )}
        {/* Description layoutId anchor */}
        {caseStudy.description && (
          <motion.div layoutId={`description-${caseStudy._id}-${id}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }} />
        )}
        {/* Title layoutId anchor */}
        <motion.div layoutId={`title-${title}-${id}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }} />
        {/* Button layoutId anchor */}
        <motion.div layoutId={`button-${title}-${id}`} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0 }} />

        {children}
      </motion.div>
    </>
  )
}
