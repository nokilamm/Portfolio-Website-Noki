"use client";

import React from 'react';

function GlassFilter() {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        <filter
          id="navbar-glass"
          x="0%" y="0%" width="100%" height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="2" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="50" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="3" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export function Navbar() {
  const navLinks = [
    { label: 'Work',    href: '/' },
    { label: 'About',   href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <GlassFilter />
      <header
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-7 py-3 rounded-full"
        style={{
          boxShadow: '0 0 8px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.08), inset 3px 3px 0.5px -3.5px rgba(255,255,255,0.09), inset -3px -3px 0.5px -3.5px rgba(255,255,255,0.85), inset 1px 1px 1px -0.5px rgba(255,255,255,0.6), inset -1px -1px 1px -0.5px rgba(255,255,255,0.6), inset 0 0 6px 6px rgba(255,255,255,0.12), inset 0 0 2px 2px rgba(255,255,255,0.06), 0 0 12px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {/* Liquid glass distortion layer */}
        <div
          className="absolute inset-0 -z-10 rounded-full overflow-hidden"
          style={{ backdropFilter: 'url("#navbar-glass")' }}
        />
        {/* Frosted base */}
        <div className="absolute inset-0 -z-10 rounded-full backdrop-blur-sm bg-white/5" />

        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="relative z-10 text-sm text-gray-400 hover:text-white transition-colors duration-200
                       after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0
                       after:bg-white/50 after:transition-[width] after:duration-200
                       hover:after:w-full"
          >
            {link.label}
          </a>
        ))}
      </header>
    </>
  );
}
