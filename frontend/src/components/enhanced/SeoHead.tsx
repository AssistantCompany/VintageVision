import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

export default function SeoHead({
  title = 'VintageVision - AI Antique Expert',
  description = 'Turn your phone into an antique expert. Instantly identify vintage treasures with AI-powered analysis.',
  image,
  type = 'website'
}: SeoHeadProps) {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    };

    // Standard meta tags
    updateMeta('description', description);
    updateMeta('keywords', 'vintage, antique, identification, AI, appraisal, collectibles');

    // Open Graph
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    if (image) {
      updateMeta('og:image', image, true);
    }
    updateMeta('og:url', window.location.href, true);
    updateMeta('og:type', type, true);

    // Twitter Card
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    if (image) {
      updateMeta('twitter:image', image);
    }
    updateMeta('twitter:card', image ? 'summary_large_image' : 'summary');

    // Structured data for search engines
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "VintageVision",
      "applicationCategory": "UtilitiesApplication",
      "description": description,
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "creator": {
        "@type": "Organization",
        "name": "VintageVision"
      }
    };

    let scriptTag = document.querySelector('#structured-data') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

  }, [title, description, image, type, location]);

  return null;
}
