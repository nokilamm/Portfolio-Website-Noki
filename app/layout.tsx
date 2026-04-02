import type { Metadata } from 'next'
import Script from "next/script";
import { Playfair_Display, Outfit } from 'next/font/google'
import './globals.css'
import { SanityLive } from '@/sanity/lib/live'
import { Navbar } from '@/components/ui/mini-navbar'
import { SiteDock } from '@/components/ui/site-dock'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Creative portfolio and case studies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body>
        <Navbar />
        {children}
        <SiteDock />
        <SanityLive />
      </body>
    </html>
  )
}
