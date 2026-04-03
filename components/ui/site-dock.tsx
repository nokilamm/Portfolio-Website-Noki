'use client'

import { FloatingDock } from "@/components/ui/floating-dock"

const links = [
  {
    title: "Email",
    icon: <img src="/icons/envelope_9073238.png" alt="Email" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />,
    href: "#",
  },
  {
    title: "LinkedIn",
    icon: <img src="/icons/linkedin_3128219.png" alt="LinkedIn" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />,
    href: "#",
  },
  {
    title: "Text Message",
    icon: <img src="/icons/imessage-er5btwlcf14q0hv9o7ogmn.webp" alt="Text Message" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />,
    href: "#",
  },
]

export function SiteDock() {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <FloatingDock items={links} />
      </div>
    </div>
  )
}
