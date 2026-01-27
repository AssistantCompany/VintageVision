import { motion } from 'framer-motion'
import {
  Armchair,
  Palette,
  Gem,
  Watch,
  BookOpen,
  Lightbulb,
  Car,
  Gamepad2,
  Scissors,
  Wine,
  Coins,
  Wrench,
  Monitor,
  HelpCircle,
  Sparkles
} from 'lucide-react'
import { DomainExpert, getDomainExpertName } from '@/types'
import { cn } from '@/lib/utils'

interface DomainExpertBadgeProps {
  expert: DomainExpert | null
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const expertConfig: Record<DomainExpert, {
  icon: typeof Armchair
  gradient: string
  description: string
}> = {
  furniture: {
    icon: Armchair,
    gradient: 'from-amber-500 to-orange-600',
    description: 'Specializing in antique and vintage furniture identification'
  },
  ceramics: {
    icon: Wine,
    gradient: 'from-blue-500 to-cyan-600',
    description: 'Expert in pottery, porcelain, and ceramic art'
  },
  glass: {
    icon: Sparkles,
    gradient: 'from-cyan-400 to-teal-500',
    description: 'Specializing in art glass, depression glass, and crystal'
  },
  silver: {
    icon: Coins,
    gradient: 'from-gray-400 to-slate-500',
    description: 'Expert in sterling silver and metalware'
  },
  jewelry: {
    icon: Gem,
    gradient: 'from-pink-500 to-rose-600',
    description: 'Specializing in vintage and antique jewelry'
  },
  watches: {
    icon: Watch,
    gradient: 'from-indigo-500 to-purple-600',
    description: 'Expert in timepieces and horology'
  },
  art: {
    icon: Palette,
    gradient: 'from-purple-500 to-violet-600',
    description: 'Specializing in paintings, prints, and fine art'
  },
  textiles: {
    icon: Scissors,
    gradient: 'from-rose-500 to-red-600',
    description: 'Expert in rugs, tapestries, and vintage textiles'
  },
  toys: {
    icon: Gamepad2,
    gradient: 'from-green-500 to-emerald-600',
    description: 'Specializing in vintage toys, dolls, and collectibles'
  },
  books: {
    icon: BookOpen,
    gradient: 'from-amber-600 to-yellow-600',
    description: 'Expert in rare books, manuscripts, and ephemera'
  },
  tools: {
    icon: Wrench,
    gradient: 'from-slate-500 to-gray-600',
    description: 'Specializing in antique tools and scientific instruments'
  },
  lighting: {
    icon: Lightbulb,
    gradient: 'from-yellow-400 to-amber-500',
    description: 'Expert in vintage lamps and lighting fixtures'
  },
  electronics: {
    icon: Monitor,
    gradient: 'from-blue-600 to-indigo-700',
    description: 'Specializing in modern electronics and tech'
  },
  vehicles: {
    icon: Car,
    gradient: 'from-red-500 to-rose-600',
    description: 'Expert in classic and vintage automobiles'
  },
  general: {
    icon: HelpCircle,
    gradient: 'from-gray-500 to-gray-600',
    description: 'General expertise across multiple categories'
  }
}

export default function DomainExpertBadge({
  expert,
  size = 'md',
  showLabel = true
}: DomainExpertBadgeProps) {
  if (!expert) return null

  const config = expertConfig[expert]
  const Icon = config.icon

  const sizeClasses = {
    sm: {
      container: 'px-2 py-1 text-xs gap-1.5',
      icon: 'w-3.5 h-3.5',
      iconBox: 'w-6 h-6'
    },
    md: {
      container: 'px-3 py-1.5 text-sm gap-2',
      icon: 'w-4 h-4',
      iconBox: 'w-8 h-8'
    },
    lg: {
      container: 'px-4 py-2 text-base gap-2.5',
      icon: 'w-5 h-5',
      iconBox: 'w-10 h-10'
    }
  }

  const sizes = sizeClasses[size]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        'inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm border border-border shadow-sm',
        sizes.container
      )}
      title={config.description}
    >
      <div className={cn(
        'rounded-full flex items-center justify-center',
        `bg-gradient-to-br ${config.gradient}`,
        sizes.iconBox
      )}>
        <Icon className={cn('text-white', sizes.icon)} />
      </div>
      {showLabel && (
        <span className="font-medium text-muted-foreground">
          {getDomainExpertName(expert)}
        </span>
      )}
    </motion.div>
  )
}

// Larger version for prominent display
export function DomainExpertCard({ expert }: { expert: DomainExpert | null }) {
  if (!expert) return null

  const config = expertConfig[expert]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-border shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center',
          `bg-gradient-to-br ${config.gradient}`
        )}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Analyzed by</p>
          <p className="font-bold text-foreground">{getDomainExpertName(expert)}</p>
          <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
        </div>
      </div>
    </motion.div>
  )
}
