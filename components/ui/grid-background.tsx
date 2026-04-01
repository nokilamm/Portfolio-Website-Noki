'use client'

import React, { useEffect } from 'react'
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from 'framer-motion'

const GridBackground: React.FC = () => {
  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)
  const offsetX = useMotionValue(0)
  const offsetY = useMotionValue(0)

  // Track mouse globally so pointer-events:none doesn't block it
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  useAnimationFrame(() => {
    offsetX.set((offsetX.get() + 0.3) % 40)
    offsetY.set((offsetY.get() + 0.3) % 40)
  })

  const maskImage = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, black, transparent)`

  const gridStyle = {
    position: 'absolute' as const,
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        background: '#0a0a0a',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Base grid — always subtly visible */}
      <motion.div
        style={{
          ...gridStyle,
          opacity: 0.55,
          backgroundPositionX: offsetX,
          backgroundPositionY: offsetY,
        }}
      />

      {/* Mouse-reveal grid — brighter near cursor */}
      <motion.div
        style={{
          ...gridStyle,
          opacity: 1,
          backgroundPositionX: offsetX,
          backgroundPositionY: offsetY,
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      />

      {/* Ambient glow blobs */}
      <div style={{
        position: 'absolute', right: '-10%', top: '-15%',
        width: '40%', height: '40%', borderRadius: '50%',
        background: 'rgba(110,70,255,0.10)', filter: 'blur(120px)',
      }} />
      <div style={{
        position: 'absolute', left: '-10%', bottom: '-15%',
        width: '40%', height: '40%', borderRadius: '50%',
        background: 'rgba(50,100,255,0.08)', filter: 'blur(120px)',
      }} />
    </div>
  )
}

export default GridBackground
