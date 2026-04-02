'use client'

import { useEffect, useRef } from 'react'

interface GlassShaderBorderProps {
  angle?: number
  offsetX?: number
  offsetY?: number
  inset?: string
  borderRadius?: string
}

export function GlassShaderBorder({
  angle = 45,
  offsetX = 0.1,
  offsetY = -0.1,
  inset = '-3px',
  borderRadius = '27px',
}: GlassShaderBorderProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Inject canvas sizing styles once
    const styleId = 'glass-shader-border-styles'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `.gsb-shader canvas { width: 100% !important; height: 100% !important; display: block !important; position: absolute !important; top: 0 !important; left: 0 !important; }`
      document.head.appendChild(style)
    }

    // biome-ignore lint/suspicious/noExplicitAny: external lib
    let mount: any = null
    import('@paper-design/shaders').then(({ ShaderMount, liquidMetalFragmentShader }) => {
      if (!el) return
      mount = new ShaderMount(el, liquidMetalFragmentShader, {
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
    }).catch((e) => console.error('[glass-shader-border]', e))

    return () => { mount?.destroy?.() }
  }, [angle, offsetX, offsetY])

  return (
    <div
      ref={ref}
      className="gsb-shader"
      style={{
        position: 'absolute',
        inset,
        borderRadius,
        overflow: 'hidden',
        zIndex: -1,
      }}
    />
  )
}
