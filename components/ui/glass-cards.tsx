'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { CaseStudy } from '@/lib/utils'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

function injectShaderStyles() {
  const styleId = 'shader-canvas-style-glass-cards'
  if (document.getElementById(styleId)) return
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    .glass-card-shader canvas {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      border-radius: 27px !important;
    }
  `
  document.head.appendChild(style)
}


interface CardProps {
  caseStudy: CaseStudy
  index: number
  totalCards: number
}

const GlassCard: React.FC<CardProps> = ({ caseStudy, index, totalCards }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const shaderBorderRef = useRef<HTMLDivElement>(null)
  // biome-ignore lint/suspicious/noExplicitAny: external lib
  const shaderMountRef = useRef<any>(null)

  // Lazy-mount shader only while this card is active — saves N-1 WebGL loops
  const mountShader = () => {
    const el = shaderBorderRef.current
    if (!el || shaderMountRef.current) return
    injectShaderStyles()
    const angle = caseStudy.shaderAngle ?? 45
    const offsetX = caseStudy.shaderOffsetX ?? 0.1
    const offsetY = caseStudy.shaderOffsetY ?? -0.1
    import('@paper-design/shaders').then(({ ShaderMount, liquidMetalFragmentShader }) => {
      if (!el || shaderMountRef.current) return
      shaderMountRef.current = new ShaderMount(el, liquidMetalFragmentShader, {
        u_repetition: 4,
        u_softness: 0.82,
        u_shiftRed: 0.3,
        u_shiftBlue: 0.3,
        u_distortion: 0,
        u_contour: 0,
        u_angle: angle,
        u_scale: 5,
        u_shape: 1,
        u_offsetX: offsetX,
        u_offsetY: offsetY,
      }, undefined, 0.6)
    }).catch((e) => console.error('[glass-card shader] failed:', e))
  }

  const destroyShader = () => {
    shaderMountRef.current?.destroy?.()
    shaderMountRef.current = null
  }

  // GSAP scroll scale + active border/shader lifecycle
  useEffect(() => {
    const card = cardRef.current
    const container = containerRef.current
    const border = shaderBorderRef.current
    if (!card || !container || !border) return

    const targetScale = 1 - (totalCards - index) * 0.05
    gsap.set(card, { scale: 1, transformOrigin: 'center top' })
    gsap.set(border, { opacity: index === 0 ? 1 : 0 })

    // Mount shader immediately for the first card
    if (index === 0) mountShader()

    const scaleTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 0.3,
      onUpdate: (self) => {
        gsap.set(card, {
          scale: Math.max(gsap.utils.interpolate(1, targetScale, self.progress), targetScale),
          transformOrigin: 'center top',
        })
      },
    })

    const activeTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        mountShader()
        gsap.to(border, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      },
      onLeave: () => {
        gsap.to(border, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: destroyShader })
      },
      onEnterBack: () => {
        mountShader()
        gsap.to(border, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      },
      onLeaveBack: () => {
        gsap.to(border, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: destroyShader })
      },
    })

    return () => {
      scaleTrigger.kill()
      activeTrigger.kill()
      destroyShader()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, totalCards])

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
      }}
    >
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          width: '70%',
          height: '450px',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.18)',
          isolation: 'isolate',
          top: `calc(-5vh + ${index * 25}px)`,
          transformOrigin: 'top',
          willChange: 'transform',
          boxShadow: `
            0 40px 60px rgba(0,0,0,0.9),
            0 15px 25px rgba(0,0,0,0.7),
            0 0 40px rgba(255,255,255,0.04)
          `,
        }}
      >
        {/* Liquid metal border — fills slightly beyond card, shader peeks out as the glowing rim */}
        <div
          ref={shaderBorderRef}
          className="glass-card-shader"
          style={{
            position: 'absolute',
            inset: '-3px',
            borderRadius: '27px',
            overflow: 'hidden',
            zIndex: -1,
          }}
        />

        {/* Card interior — dark glass, blocks shader except for 3px rim */}
        <Link href={`/work/${caseStudy.slug}`} style={{ display: 'block', height: '100%' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '2.5rem',
              borderRadius: '24px',
              background: 'rgba(12, 12, 12, 0.82)',
              backdropFilter: 'blur(10px) saturate(140%) brightness(0.9)',
              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.12),
                inset 0 -1px 0 rgba(0,0,0,0.4),
                inset 1px 0 0 rgba(255,255,255,0.05),
                inset -1px 0 0 rgba(0,0,0,0.2)
              `,
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {/* Upper gloss — curved light reflection in top third */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '42%',
              background: 'linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 40%, transparent 100%)',
              borderRadius: '24px 24px 0 0',
              pointerEvents: 'none',
            }} />
            {/* Top specular line — simulates light hitting the top rim */}
            <div style={{
              position: 'absolute', top: '1px', left: '12%', right: '12%', height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 35%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.35) 65%, transparent 100%)',
              pointerEvents: 'none',
            }} />
            {/* Left edge catch light */}
            <div style={{
              position: 'absolute', top: '8%', left: '1px', width: '1px', bottom: '30%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />

            {/* Tags */}
            {caseStudy.tags && caseStudy.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
                {caseStudy.tags.slice(0, 3).map((tag) => (
                  <span key={tag} style={{ fontSize: '0.7rem', fontFamily: 'Outfit, sans-serif', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '0.75rem', position: 'relative', zIndex: 2, textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
              {caseStudy.client || caseStudy.title}
            </h3>

            {/* Description */}
            {caseStudy.description && (
              <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300, fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, position: 'relative', zIndex: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {caseStudy.description}
              </p>
            )}

            {/* Year / Role */}
            {(caseStudy.year || caseStudy.role) && (
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                {caseStudy.year && <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>{caseStudy.year}</span>}
                {caseStudy.role && <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>{caseStudy.role}</span>}
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}

interface GlassCardsProps {
  caseStudies: CaseStudy[]
}

export const GlassCards: React.FC<GlassCardsProps> = ({ caseStudies }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    gsap.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' })
  }, [])

  return (
    <main ref={containerRef} style={{ background: '#141414' }}>
      <section style={{ color: '#ffffff', width: '100%' }}>
        {caseStudies.map((cs, index) => (
          <GlassCard
            key={cs._id}
            caseStudy={cs}
            index={index}
            totalCards={caseStudies.length}
          />
        ))}
      </section>
    </main>
  )
}
