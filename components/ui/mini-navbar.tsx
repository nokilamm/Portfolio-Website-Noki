'use client'

import { LimelightNav } from '@/components/ui/limelight-nav'

const navLinks = [
  { label: 'Work',  href: '/' },
  { label: 'About', href: '/about' },
]

export function Navbar() {
  return <LimelightNav items={navLinks} />
}
