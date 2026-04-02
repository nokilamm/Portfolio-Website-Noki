'use client'

import { cn } from "@/lib/utils"
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { useRef, useState } from "react"

interface DockItem {
  title: string
  icon: React.ReactNode
  href: string
}

export function FloatingDock({
  items,
  className,
}: {
  items: DockItem[]
  className?: string
  mobileClassName?: string
}) {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn("mx-auto flex h-14 items-end gap-3 rounded-full px-4 pb-3", className)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(2px) saturate(180%)',
        WebkitBackdropFilter: 'blur(2px) saturate(180%)',
        boxShadow: `
          inset 1px 1px 0px rgba(255,255,255,0.25),
          inset -1px -1px 0px rgba(255,255,255,0.08),
          inset 0 0 20px rgba(255,255,255,0.03),
          0 8px 32px rgba(0,0,0,0.4),
          0 2px 8px rgba(0,0,0,0.3)
        `,
      }}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  )
}

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue
  title: string
  icon: React.ReactNode
  href: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthTransform = useTransform(distance, [-150, 0, 150], [36, 60, 36])
  const heightTransform = useTransform(distance, [-150, 0, 150], [36, 60, 36])
  const widthIconTransform = useTransform(distance, [-150, 0, 150], [18, 30, 18])
  const heightIconTransform = useTransform(distance, [-150, 0, 150], [18, 30, 18])

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 })
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 })
  const widthIcon = useSpring(widthIconTransform, { mass: 0.1, stiffness: 150, damping: 12 })
  const heightIcon = useSpring(heightIconTransform, { mass: 0.1, stiffness: 150, damping: 12 })

  const [hovered, setHovered] = useState(false)

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-xl"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 4, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-white/10 bg-black/70 backdrop-blur-md px-2 py-0.5 text-xs text-white/80 whitespace-pre"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon, filter: "brightness(0) invert(1)" }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  )
}
