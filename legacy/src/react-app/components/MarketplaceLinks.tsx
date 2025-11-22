import { ExternalLink, ShoppingBag, TrendingUp } from 'lucide-react';

interface MarketplaceLink {
  marketplace: string;
  url: string;
  priceMin?: number;
  priceMax?: number;
}

interface MarketplaceLinksProps {
  links: MarketplaceLink[];
  itemName: string;
}

export default function MarketplaceLinks({ links, itemName }: MarketplaceLinksProps) {
  if (!links || links.length === 0) {
    return null;
  }

  const getMarketplaceLogo = (marketplace: string) => {
    const logos: Record<string, string> = {
      'eBay': '🏪',
      'Etsy': '🎨',
      'Chairish': '🪑',
      '1stDibs': '💎'
    };
    return logos[marketplace] || '🛍️';
  };

  

  

  const formatPriceRange = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `$${min} - $${max}`;
    return `~$${min || max}`;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-blue-800">Find Similar Items</h3>
      </div>

      <div className="space-y-3">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg border border-blue-100 p-4 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${getMarketplaceLogo(link.marketplace)} rounded-lg flex items-center justify-center text-lg`}>
                  {getMarketplaceLogo(link.marketplace)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {link.marketplace}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Search for "{itemName}"
                  </p>
                  {formatPriceRange(link.priceMin, link.priceMax) && (
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        {formatPriceRange(link.priceMin, link.priceMax)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
        <p className="text-xs text-blue-700">
          💰 <strong>VintageVision earns a small commission</strong> when you purchase through these links, 
          helping us keep the app free while you get the best deals on authentic vintage pieces.
        </p>
      </div>
    </div>
  );
}
