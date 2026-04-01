import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { CaseStudy } from '@/lib/utils'

interface SanityImageProps {
  value: CaseStudy['coverImage']
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
}

export function SanityImage({ value, width = 1200, height, className, priority, fill }: SanityImageProps) {
  if (!value?.asset) {
    return (
      <img
        src={`https://placehold.co/${width}x${height || Math.round(width / 1.6)}`}
        alt={value?.alt || ''}
        className={className}
        width={width}
        height={height || Math.round(width / 1.6)}
      />
    )
  }

  const imageUrl = urlFor(value)
    .width(width)
    .height(height || Math.round(width / 1.6))
    .url()

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={value.alt || ''}
        fill
        className={className}
        priority={priority}
        placeholder={value.asset.metadata?.lqip ? 'blur' : 'empty'}
        blurDataURL={value.asset.metadata?.lqip}
      />
    )
  }

  return (
    <Image
      src={imageUrl}
      alt={value.alt || ''}
      width={width}
      height={height || Math.round(width / 1.6)}
      className={className}
      priority={priority}
      placeholder={value.asset.metadata?.lqip ? 'blur' : 'empty'}
      blurDataURL={value.asset.metadata?.lqip}
    />
  )
}
