"use client";

import React from 'react';

export function Navbar() {
  const navLinks = [
    { label: 'Work',    href: '/' },
    { label: 'About',   href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-7 py-3 rounded-full backdrop-blur-md"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: `
          inset 1px 1px 1px rgba(255,255,255,0.18),
          inset -1px -1px 1px rgba(255,255,255,0.06),
          inset 0 0 12px rgba(255,255,255,0.04),
          0 4px 24px rgba(0,0,0,0.3),
          0 1px 2px rgba(0,0,0,0.2)
        `,
      }}
    >
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="relative text-sm text-gray-400 hover:text-white transition-colors duration-200
                     after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0
                     after:bg-white/50 after:transition-[width] after:duration-200
                     hover:after:w-full"
        >
          {link.label}
        </a>
      ))}
    </header>
  );
}
