import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface ParallaxContainerProps {
  children: React.ReactNode
  offset?: number
  className?: string
}

export default function ParallaxContainer({
  children,
  offset = 50,
  className = ''
}: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}
