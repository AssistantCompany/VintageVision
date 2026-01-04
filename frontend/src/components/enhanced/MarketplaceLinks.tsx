import { motion } from 'framer-motion'
import { ExternalLink, ShoppingBag, Search } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/utils'

interface MarketplaceLink {
  marketplace: string
  url: string
}

interface MarketplaceLinksProps {
  links: MarketplaceLink[] | null
  itemName: string
}

const marketplaceConfig: Record<string, {
  color: string
  bgColor: string
  borderColor: string
  logo?: string
}> = {
  'ebay': {
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    borderColor: 'border-blue-200'
  },
  'amazon': {
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
    borderColor: 'border-orange-200'
  },
  'etsy': {
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
    borderColor: 'border-orange-200'
  },
  'walmart': {
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    borderColor: 'border-blue-200'
  },
  'best buy': {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
    borderColor: 'border-yellow-200'
  },
  '1stdibs': {
    color: 'text-gray-700',
    bgColor: 'bg-gray-50 hover:bg-gray-100',
    borderColor: 'border-gray-200'
  },
  'chairish': {
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 hover:bg-pink-100',
    borderColor: 'border-pink-200'
  },
  'ruby lane': {
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100',
    borderColor: 'border-red-200'
  },
  'default': {
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 hover:bg-gray-100',
    borderColor: 'border-gray-200'
  }
}

function getMarketplaceConfig(name: string) {
  const lowerName = name.toLowerCase()
  for (const [key, config] of Object.entries(marketplaceConfig)) {
    if (lowerName.includes(key)) {
      return config
    }
  }
  return marketplaceConfig.default
}

export default function MarketplaceLinks({
  links,
  itemName
}: MarketplaceLinksProps) {
  if (!links || links.length === 0) return null

  const handleLinkClick = (marketplace: string, url: string) => {
    trackEvent('marketplace_link_clicked', {
      itemName,
      marketplace,
      url
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <GlassCard className="p-5" gradient="default">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Shop Similar Items</h3>
            <p className="text-sm text-gray-500">Find this item or similar on marketplaces</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {links.map((link, index) => {
            const config = getMarketplaceConfig(link.marketplace)

            return (
              <motion.a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.marketplace, link.url)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all',
                  config.bgColor,
                  config.borderColor
                )}
              >
                <Search className={cn('w-4 h-4', config.color)} />
                <span className={cn('font-medium text-sm', config.color)}>
                  {link.marketplace}
                </span>
                <ExternalLink className={cn('w-3 h-3 opacity-60', config.color)} />
              </motion.a>
            )
          })}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Links open in a new tab. Prices and availability may vary.
        </p>
      </GlassCard>
    </motion.div>
  )
}
