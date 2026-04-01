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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-8 px-7 py-4"
      style={{
        background: 'rgba(20,20,20,0.7)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
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
          style={{ fontFamily: 'Times New Roman, Times, serif', fontStyle: 'italic' }}
        >
          {link.label.toLowerCase()}
        </a>
      ))}
    </header>
  );
}
