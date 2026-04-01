import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface CaseStudy {
  _id: string
  title: string
  slug: string
  client?: string
  description?: string
  tags?: string[]
  coverImage?: {
    asset?: {
      _id: string
      url: string
      metadata?: {
        lqip?: string
        dimensions?: { width: number; height: number }
      }
    }
    alt?: string
    hotspot?: { x: number; y: number }
    crop?: { top: number; bottom: number; left: number; right: number }
  }
  color?: string
  shaderAngle?: number
  shaderOffsetX?: number
  shaderOffsetY?: number
  year?: string
  role?: string
  order?: number
  content?: unknown[]
}
