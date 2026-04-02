'use client'

import React, { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

type NavItem = {
  label: string
  href: string
}

type LimelightNavProps = {
  items: NavItem[]
}

export function LimelightNav({ items }: LimelightNavProps) {
  const pathname = usePathname()

  const activeIndex = (() => {
    const exact = items.findIndex((item) => item.href === pathname)
    if (exact !== -1) return exact
    // fallback: match by prefix (e.g. /work/slug → /work)
    const prefix = items.findIndex(
      (item) => item.href !== '/' && pathname.startsWith(item.href)
    )
    return prefix !== -1 ? prefix : 0
  })()

  const [isReady, setIsReady] = useState(false)
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const limelightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const limelight = limelightRef.current
    const activeItem = navItemRefs.current[activeIndex]
    if (!limelight || !activeItem) return

    const newLeft =
      activeItem.offsetLeft +
      activeItem.offsetWidth / 2 -
      limelight.offsetWidth / 2

    if (!isReady) {
      // Initial placement: disable transition, snap into position, then enable
      limelight.style.transition = 'none'
      limelight.style.left = `${newLeft}px`
      // Force a reflow so the browser registers the position before enabling transition
      limelight.getBoundingClientRect()
      limelight.style.transition = ''
      setIsReady(true)
    } else {
      limelight.style.left = `${newLeft}px`
    }
  }, [activeIndex, isReady])

  return (
    <header
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-7 py-3 rounded-full"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(2px) saturate(180%)',
        WebkitBackdropFilter: 'blur(2px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: `
          inset 1px 1px 0px rgba(255,255,255,0.25),
          inset -1px -1px 0px rgba(255,255,255,0.08),
          inset 0 0 20px rgba(255,255,255,0.03),
          0 8px 32px rgba(0,0,0,0.4),
          0 2px 8px rgba(0,0,0,0.3)
        `,
      }}
    >
      {/* Limelight bar */}
      <div
        ref={limelightRef}
        className="absolute top-0 z-10 w-8 h-[2px] rounded-full"
        style={{
          left: '-999px',
          transition: isReady ? 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          background: 'rgba(255,255,255,0.9)',
          boxShadow: '0 0 12px 2px rgba(255,255,255,0.4), 0 30px 20px rgba(255,255,255,0.06)',
        }}
      >
        {/* Cone glow beneath the bar */}
        <div
          className="absolute left-[-40%] top-[2px] w-[180%] h-10 pointer-events-none"
          style={{
            clipPath: 'polygon(10% 100%, 25% 0, 75% 0, 90% 100%)',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)',
          }}
        />
      </div>

      {/* Nav links */}
      {items.map((item, index) => (
        <Link
          key={item.href}
          ref={(el) => { navItemRefs.current[index] = el }}
          href={item.href}
          className="relative z-20 text-sm transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-rinter)',
            fontStyle: 'normal',
            color: activeIndex === index ? 'rgba(255,255,255,0.9)' : 'rgba(156,163,175,1)',
          }}
        >
          {item.label.toLowerCase()}
        </Link>
      ))}
    </header>
  )
}
