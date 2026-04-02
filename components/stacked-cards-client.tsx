'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { CaseStudy } from '@/lib/utils'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

const HEADER_H = 72

interface StackedCardsClientProps {
  caseStudies: CaseStudy[]
}

export default function StackedCardsClient({ caseStudies }: StackedCardsClientProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const shadersInitialized = useRef(false)

  // Initialize liquid metal shaders
  useEffect(() => {
    if (shadersInitialized.current) return
    shadersInitialized.current = true

    const shaderContainers = document.querySelectorAll<HTMLElement>('.card-shader-bg')
    if (!shaderContainers.length) return

    import('@paper-design/shaders').then(({ ShaderMount, liquidMetalFragmentShader }) => {
      shaderContainers.forEach((container) => {
        const angle = parseFloat(container.dataset.angle ?? '45')
        const offsetX = parseFloat(container.dataset.offsetX ?? '0.1')
        const offsetY = parseFloat(container.dataset.offsetY ?? '-0.1')

        new ShaderMount(container, liquidMetalFragmentShader, {
          u_repetition: 3.5,
          u_softness: 0.5,
          u_shiftRed: 0.3,
          u_shiftBlue: 0.3,
          u_distortion: 0,
          u_contour: 0,
          u_angle: angle,
          u_scale: 6,
          u_shape: 1,
          u_offsetX: offsetX,
          u_offsetY: offsetY,
        }, undefined, 0.5)
      })
    }).catch((e) => console.error('[shader] failed to load:', e))
  }, [])

  // GSAP scroll animation
  useEffect(() => {
    const wrapper = wrapperRef.current
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]
    if (!wrapper || cards.length === 0) return

    const numCards = cards.length

    // Set initial positions
    cards.forEach((card, i) => {
      if (i > 0) gsap.set(card, { y: '100vh' })
    })

    wrapper.style.height = `${(numCards - 1) * 100 + 100}vh`

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${(numCards - 1) * window.innerHeight}`,
        scrub: 0.6,
      },
    })

    // Slide cards up
    cards.forEach((card, i) => {
      if (i === 0) return
      tl.to(card, { y: i * HEADER_H, ease: 'none', duration: 1 }, i - 1)
    })

    // Darken stacked headers
    cards.forEach((card, i) => {
      if (i === 0) return
      for (let prev = 0; prev < i; prev++) {
        const overlay = cards[prev].querySelector<HTMLElement>('.card-header-overlay')
        if (!overlay) continue
        const targetOpacity = Math.min(0.18 * (i - prev), 0.55)
        tl.to(overlay, { opacity: targetOpacity, ease: 'none', duration: 0.5 }, i - 1)
      }
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [caseStudies])

  if (caseStudies.length === 0) return null

  return (
    <div
      ref={wrapperRef}
      id="stage-wrapper"
      style={{ position: 'relative' }}
    >
      <div
        ref={stageRef}
        id="stage"
        style={{ position: 'sticky', top: 0, height: '100dvh', overflow: 'hidden' }}
      >
        <div id="cards-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
          {caseStudies.map((cs, i) => (
            <div
              key={cs._id}
              ref={(el) => { cardsRef.current[i] = el }}
              className="project-card"
              data-index={i}
              style={{
                position: 'absolute',
                inset: 0,
                padding: '0 4vw',
                willChange: 'transform',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  flex: 1,
                  borderRadius: '18px 18px 0 0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderBottom: 'none',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                {/* Shader background */}
                <div
                  className="card-shader-bg"
                  data-angle={cs.shaderAngle ?? 45}
                  data-offset-x={cs.shaderOffsetX ?? 0.1}
                  data-offset-y={cs.shaderOffsetY ?? -0.1}
                  style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}
                />

                {/* Card header */}
                <Link
                  href={`/work/${cs.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      height: `${HEADER_H}px`,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 2rem',
                      position: 'relative',
                      zIndex: 2,
                      overflow: 'hidden',
                      background: 'rgba(0,0,0,0.28)',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.20)',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-rinter)',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: 'clamp(1.4rem, 2.4vw, 2rem)',
                        color: 'rgba(255,255,255,0.88)',
                        letterSpacing: '-0.01em',
                        position: 'relative',
                        zIndex: 2,
                        textShadow: '0 1px 12px rgba(0,0,0,0.5)',
                      }}
                    >
                      {cs.client || cs.title}
                    </span>

                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.70)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </div>

                    {/* Darkening overlay for stacked effect */}
                    <div
                      className="card-header-overlay"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(10,2,2,0.75)',
                        opacity: 0,
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
