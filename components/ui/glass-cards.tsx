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

// SVG glass distortion filter — injected once into the DOM
function GlassFilter() {
  return (
    <svg className="absolute" style={{ width: 0, height: 0, position: 'absolute' }}>
      <defs>
        <filter
          id="card-glass-filter"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.04" numOctaves="1" seed="2" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="3" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="50" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="3" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
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

  // GSAP scroll scale effect
  useEffect(() => {
    const card = cardRef.current
    const container = containerRef.current
    if (!card || !container) return

    const targetScale = 1 - (totalCards - index) * 0.05

    gsap.set(card, { scale: 1, transformOrigin: 'center top' })

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        const scale = gsap.utils.interpolate(1, targetScale, self.progress)
        gsap.set(card, {
          scale: Math.max(scale, targetScale),
          transformOrigin: 'center top',
        })
      },
    })

    return () => trigger.kill()
  }, [index, totalCards])

  // Liquid metal shader border
  useEffect(() => {
    injectShaderStyles()
    if (!shaderBorderRef.current) return

    const el = shaderBorderRef.current
    const angle = caseStudy.shaderAngle ?? 45
    const offsetX = caseStudy.shaderOffsetX ?? 0.1
    const offsetY = caseStudy.shaderOffsetY ?? -0.1

    import('@paper-design/shaders').then(({ ShaderMount, liquidMetalFragmentShader }) => {
      if (!el) return
      shaderMountRef.current = new ShaderMount(
        el,
        liquidMetalFragmentShader,
        {
          u_repetition: 4,
          u_softness: 0.5,
          u_shiftRed: 0.3,
          u_shiftBlue: 0.3,
          u_distortion: 0,
          u_contour: 0,
          u_angle: angle,
          u_scale: 8,
          u_shape: 1,
          u_offsetX: offsetX,
          u_offsetY: offsetY,
        },
        undefined,
        0.6,
      )
    }).catch((e) => console.error('[glass-card shader] failed:', e))

    return () => {
      shaderMountRef.current?.destroy?.()
      shaderMountRef.current = null
    }
  }, [caseStudy.shaderAngle, caseStudy.shaderOffsetX, caseStudy.shaderOffsetY])

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
          isolation: 'isolate',
          top: `calc(-5vh + ${index * 25}px)`,
          transformOrigin: 'top',
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
              background: 'linear-gradient(180deg, #111111 0%, #060606 100%)',
              boxShadow: `
                inset 3px 3px 0.5px -3.5px rgba(255,255,255,0.09),
                inset -3px -3px 0.5px -3.5px rgba(255,255,255,0.85),
                inset 1px 1px 1px -0.5px rgba(255,255,255,0.6),
                inset -1px -1px 1px -0.5px rgba(255,255,255,0.6),
                inset 0 0 6px 6px rgba(255,255,255,0.12),
                inset 0 0 2px 2px rgba(255,255,255,0.06),
                0 0 12px rgba(0,0,0,0.15)
              `,
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {/* Glass distortion backdrop layer */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '24px',
                backdropFilter: 'url("#card-glass-filter")',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

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
    <main ref={containerRef} style={{ background: '#0a0a0a' }}>
      {/* SVG filter injected once for all cards */}
      <GlassFilter />
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
