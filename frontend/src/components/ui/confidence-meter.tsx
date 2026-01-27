import * as React from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { confidenceFill } from "@/lib/animations"

interface ConfidenceBreakdown {
  label: string
  value: number
  description?: string
}

interface ConfidenceMeterProps {
  /** Overall confidence value (0-100) */
  confidence: number
  /** Size of the meter */
  size?: "sm" | "md" | "lg"
  /** Breakdown of confidence factors */
  breakdown?: ConfidenceBreakdown[]
  /** Label to display */
  label?: string
  /** Whether to show the percentage value */
  showValue?: boolean
  /** Whether the meter is expandable to show breakdown */
  expandable?: boolean
  /** Custom className */
  className?: string
}

const sizes = {
  sm: { width: 80, strokeWidth: 6, fontSize: "text-lg" },
  md: { width: 120, strokeWidth: 8, fontSize: "text-2xl" },
  lg: { width: 160, strokeWidth: 10, fontSize: "text-3xl" },
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return "hsl(var(--primary))" // Brass for high confidence
  if (confidence >= 60) return "hsl(var(--brass-light))"
  if (confidence >= 40) return "hsl(var(--muted-foreground))"
  return "hsl(var(--destructive))"
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 90) return "Very High"
  if (confidence >= 75) return "High"
  if (confidence >= 60) return "Moderate"
  if (confidence >= 40) return "Low"
  return "Very Low"
}

export function ConfidenceMeter({
  confidence,
  size = "md",
  breakdown,
  label = "Confidence",
  showValue = true,
  expandable = true,
  className,
}: ConfidenceMeterProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const { width, strokeWidth, fontSize } = sizes[size]

  const radius = (width - strokeWidth) / 2
  const normalizedConfidence = Math.min(100, Math.max(0, confidence))
  const strokeColor = getConfidenceColor(normalizedConfidence)

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Arc meter */}
      <div className="relative" style={{ width, height: width / 2 + 20 }}>
        <svg
          width={width}
          height={width / 2 + 20}
          viewBox={`0 0 ${width} ${width / 2 + 20}`}
          className="transform -rotate-180"
        >
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${width / 2 + 10} A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${width / 2 + 10}`}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Foreground arc (animated) */}
          <motion.path
            d={`M ${strokeWidth / 2} ${width / 2 + 10} A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${width / 2 + 10}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            variants={confidenceFill}
            initial="initial"
            animate="animate"
            custom={normalizedConfidence}
            style={{
              pathLength: 0,
              filter: `drop-shadow(0 0 8px ${strokeColor})`,
            }}
          />
        </svg>

        {/* Center text */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <motion.span
              className={cn("font-display font-bold text-foreground", fontSize)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              {normalizedConfidence}%
            </motion.span>
          </div>
        )}
      </div>

      {/* Label and confidence level */}
      <div className="mt-2 text-center">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p
          className="text-sm font-medium"
          style={{ color: strokeColor }}
        >
          {getConfidenceLabel(normalizedConfidence)}
        </p>
      </div>

      {/* Expandable breakdown */}
      {expandable && breakdown && breakdown.length > 0 && (
        <div className="mt-4 w-full">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>View breakdown</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isExpanded && "rotate-180"
              )}
            />
          </button>

          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3"
            >
              {breakdown.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium" style={{ color: getConfidenceColor(item.value) }}>
                      {item.value}%
                    </span>
                  </div>
                  {/* Mini progress bar */}
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: getConfidenceColor(item.value) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                    />
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

// Compact inline version
interface ConfidenceBadgeProps {
  confidence: number
  showLabel?: boolean
  className?: string
}

export function ConfidenceBadge({
  confidence,
  showLabel = true,
  className,
}: ConfidenceBadgeProps) {
  const normalizedConfidence = Math.min(100, Math.max(0, confidence))
  const color = getConfidenceColor(normalizedConfidence)

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1",
        className
      )}
      style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}
    >
      {/* Mini arc indicator */}
      <svg width="16" height="10" viewBox="0 0 16 10" className="shrink-0">
        <path
          d="M 1 9 A 7 7 0 0 1 15 9"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <motion.path
          d="M 1 9 A 7 7 0 0 1 15 9"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: normalizedConfidence / 100 }}
          transition={{ duration: 0.8 }}
        />
      </svg>
      <span className="text-sm font-medium" style={{ color }}>
        {normalizedConfidence}%
      </span>
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          {getConfidenceLabel(normalizedConfidence)}
        </span>
      )}
    </div>
  )
}
