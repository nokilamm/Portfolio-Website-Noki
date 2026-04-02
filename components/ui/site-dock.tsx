'use client'

import { FloatingDock } from "@/components/ui/floating-dock"
import Image from "next/image"

const links = [
  {
    title: "Email",
    icon: (
      <Image src="/icons/envelope_9073238.png" alt="Email" width={20} height={20} className="object-contain" />
    ),
    href: "#",
  },
  {
    title: "LinkedIn",
    icon: (
      <Image src="/icons/linkedin_3128219.png" alt="LinkedIn" width={20} height={20} className="object-contain" />
    ),
    href: "#",
  },
  {
    title: "Text Message",
    icon: (
      <Image src="/icons/imessage-er5btwlcf14q0hv9o7ogmn.webp" alt="Text Message" width={20} height={20} className="object-contain" />
    ),
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
