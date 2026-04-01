"use client";

import React from 'react';

export function Navbar() {
  const navLinks = [
    { label: 'Work',    href: '/' },
    { label: 'About',   href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                       flex items-center gap-8
                       px-7 py-3
                       rounded-full
                       border border-white/10 bg-white/5 backdrop-blur-sm">
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
