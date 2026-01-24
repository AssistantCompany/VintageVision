/**
 * PDF Export Utility for VintageVision Analysis Results
 *
 * Uses browser's print API with print-optimized HTML to generate PDFs.
 * This approach works across all browsers without external dependencies.
 */

import { ItemAnalysis, formatPriceRange, formatPrice, getDomainExpertName } from '@/types'

interface PDFExportOptions {
  includeImage?: boolean
  includeMarketData?: boolean
  includeAuthentication?: boolean
  includeStyling?: boolean
}

const defaultOptions: PDFExportOptions = {
  includeImage: true,
  includeMarketData: true,
  includeAuthentication: true,
  includeStyling: false
}

/**
 * Format product category for display
 */
function formatProductCategory(category: string): string {
  const categories: Record<string, string> = {
    'antique': 'Antique',
    'vintage': 'Vintage',
    'modern_branded': 'Modern Branded',
    'modern_generic': 'Modern'
  }
  return categories[category] || category
}

/**
 * Format deal rating for display
 */
function formatDealRating(rating: string): string {
  const ratings: Record<string, string> = {
    'exceptional': 'Exceptional Deal',
    'good': 'Good Value',
    'fair': 'Fair Price',
    'overpriced': 'Overpriced'
  }
  return ratings[rating] || rating
}

/**
 * Format authentication verdict
 */
function formatAuthVerdict(verdict: string): string {
  const verdicts: Record<string, string> = {
    'likely_authentic': 'Likely Authentic',
    'likely_fake': 'Likely Not Authentic',
    'inconclusive': 'Inconclusive',
    'needs_expert': 'Expert Review Recommended'
  }
  return verdicts[verdict] || verdict
}

/**
 * Format demand level
 */
function formatDemandLevel(level: string): string {
  const levels: Record<string, string> = {
    'hot': 'High Demand',
    'steady': 'Steady',
    'slow': 'Slow',
    'cold': 'Low Demand'
  }
  return levels[level] || level
}

/**
 * Get CSS styles for print document
 */
function getPrintStyles(confidencePercent: number): string {
  return `
    @page {
      size: A4;
      margin: 20mm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #ffffff;
      padding: 0;
    }

    .container {
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #d4a574;
      margin-bottom: 24px;
    }

    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #8b5a2b;
      letter-spacing: 2px;
      margin-bottom: 4px;
    }

    .tagline {
      font-size: 12px;
      color: #666;
      font-style: italic;
    }

    .main-section {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
    }

    .image-section {
      flex: 0 0 45%;
    }

    .image-section img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .info-section {
      flex: 1;
    }

    .item-name {
      font-size: 24px;
      font-weight: bold;
      color: #2c1810;
      margin-bottom: 8px;
      line-height: 1.3;
    }

    .maker {
      font-size: 16px;
      color: #8b5a2b;
      margin-bottom: 12px;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }

    .tag {
      display: inline-block;
      padding: 4px 12px;
      background: #f5f0eb;
      border: 1px solid #d4a574;
      border-radius: 20px;
      font-size: 11px;
      color: #5c4033;
    }

    .confidence-badge {
      display: inline-block;
      padding: 6px 16px;
      background: ${confidencePercent >= 80 ? '#d4edda' : confidencePercent >= 60 ? '#fff3cd' : '#f8d7da'};
      color: ${confidencePercent >= 80 ? '#155724' : confidencePercent >= 60 ? '#856404' : '#721c24'};
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 16px;
    }

    .description {
      font-size: 14px;
      color: #444;
      margin-bottom: 16px;
      text-align: justify;
    }

    .section {
      background: #faf8f5;
      border: 1px solid #e8e0d5;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #8b5a2b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #d4a574;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .stat {
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-size: 16px;
      font-weight: bold;
      color: #2c1810;
    }

    .stat-value.highlight {
      color: #8b5a2b;
      font-size: 20px;
    }

    .deal-rating {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 14px;
    }

    .deal-exceptional { background: #d4edda; color: #155724; }
    .deal-good { background: #cce5ff; color: #004085; }
    .deal-fair { background: #fff3cd; color: #856404; }
    .deal-overpriced { background: #f8d7da; color: #721c24; }

    .evidence-list {
      list-style: none;
    }

    .evidence-list li {
      padding: 6px 0;
      padding-left: 20px;
      position: relative;
      font-size: 13px;
    }

    .evidence-list li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 12px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .evidence-for li::before {
      background: #28a745;
    }

    .evidence-against li::before {
      background: #dc3545;
    }

    .auth-verdict {
      padding: 12px 16px;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
      margin-bottom: 12px;
    }

    .auth-authentic { background: #d4edda; color: #155724; }
    .auth-fake { background: #f8d7da; color: #721c24; }
    .auth-inconclusive { background: #fff3cd; color: #856404; }
    .auth-expert { background: #e2d5f1; color: #4a148c; }

    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #d4a574;
      text-align: center;
      font-size: 11px;
      color: #888;
    }

    .disclaimer {
      font-size: 10px;
      color: #999;
      font-style: italic;
      margin-top: 8px;
    }

    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      .section {
        break-inside: avoid;
      }

      .main-section {
        break-inside: avoid;
      }
    }
  `
}

/**
 * Helper function to create a stat element
 */
function createStat(doc: Document, label: string, value: string, highlight = false): HTMLElement {
  const stat = doc.createElement('div')
  stat.className = 'stat'

  const statLabel = doc.createElement('div')
  statLabel.className = 'stat-label'
  statLabel.textContent = label
  stat.appendChild(statLabel)

  const statValue = doc.createElement('div')
  statValue.className = highlight ? 'stat-value highlight' : 'stat-value'
  statValue.textContent = value
  stat.appendChild(statValue)

  return stat
}

/**
 * Build the print document using safe DOM manipulation
 */
function buildPrintDocument(
  targetDoc: Document,
  analysis: ItemAnalysis,
  options: PDFExportOptions
): void {
  const {
    includeImage,
    includeMarketData,
    includeAuthentication
  } = options

  const confidencePercent = Math.round(analysis.confidence * 100)
  const dateGenerated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Set document title
  targetDoc.title = `${analysis.name} - VintageVision Analysis`

  // Clear and rebuild head
  while (targetDoc.head.firstChild) {
    targetDoc.head.removeChild(targetDoc.head.firstChild)
  }

  // Add meta charset
  const charset = targetDoc.createElement('meta')
  charset.setAttribute('charset', 'UTF-8')
  targetDoc.head.appendChild(charset)

  // Add viewport meta
  const viewport = targetDoc.createElement('meta')
  viewport.name = 'viewport'
  viewport.content = 'width=device-width, initial-scale=1.0'
  targetDoc.head.appendChild(viewport)

  // Add styles
  const style = targetDoc.createElement('style')
  style.textContent = getPrintStyles(confidencePercent)
  targetDoc.head.appendChild(style)

  // Clear and rebuild body
  while (targetDoc.body.firstChild) {
    targetDoc.body.removeChild(targetDoc.body.firstChild)
  }

  // Create container
  const container = targetDoc.createElement('div')
  container.className = 'container'

  // Header
  const header = targetDoc.createElement('div')
  header.className = 'header'
  const logo = targetDoc.createElement('div')
  logo.className = 'logo'
  logo.textContent = 'VINTAGEVISION'
  const tagline = targetDoc.createElement('div')
  tagline.className = 'tagline'
  tagline.textContent = 'AI-Powered Antique & Vintage Analysis'
  header.appendChild(logo)
  header.appendChild(tagline)
  container.appendChild(header)

  // Main Section
  const mainSection = targetDoc.createElement('div')
  mainSection.className = 'main-section'

  // Image Section
  if (includeImage) {
    const imageSection = targetDoc.createElement('div')
    imageSection.className = 'image-section'
    const img = targetDoc.createElement('img')
    img.src = analysis.imageUrl
    img.alt = analysis.name
    imageSection.appendChild(img)
    mainSection.appendChild(imageSection)
  }

  // Info Section
  const infoSection = targetDoc.createElement('div')
  infoSection.className = 'info-section'

  const itemName = targetDoc.createElement('h1')
  itemName.className = 'item-name'
  itemName.textContent = analysis.name
  infoSection.appendChild(itemName)

  if (analysis.maker) {
    const maker = targetDoc.createElement('div')
    maker.className = 'maker'
    maker.textContent = `By ${analysis.maker}`
    infoSection.appendChild(maker)
  } else if (analysis.brand) {
    const maker = targetDoc.createElement('div')
    maker.className = 'maker'
    maker.textContent = analysis.brand + (analysis.modelNumber ? ` ${analysis.modelNumber}` : '')
    infoSection.appendChild(maker)
  }

  // Tags
  const tags = targetDoc.createElement('div')
  tags.className = 'tags'

  const tagValues = [
    analysis.productCategory ? formatProductCategory(analysis.productCategory) : null,
    analysis.era,
    analysis.style,
    analysis.originRegion,
    analysis.domainExpert ? getDomainExpertName(analysis.domainExpert) : null
  ].filter(Boolean)

  tagValues.forEach(tagText => {
    const tag = targetDoc.createElement('span')
    tag.className = 'tag'
    tag.textContent = tagText as string
    tags.appendChild(tag)
  })

  infoSection.appendChild(tags)

  // Confidence Badge
  const confidenceBadge = targetDoc.createElement('div')
  confidenceBadge.className = 'confidence-badge'
  confidenceBadge.textContent = `${confidencePercent}% Confidence`
  infoSection.appendChild(confidenceBadge)

  // Description
  const description = targetDoc.createElement('p')
  description.className = 'description'
  description.textContent = analysis.description
  infoSection.appendChild(description)

  mainSection.appendChild(infoSection)
  container.appendChild(mainSection)

  // Valuation Section
  const valuationSection = targetDoc.createElement('div')
  valuationSection.className = 'section'

  const valuationTitle = targetDoc.createElement('div')
  valuationTitle.className = 'section-title'
  valuationTitle.textContent = 'Valuation'
  valuationSection.appendChild(valuationTitle)

  const valuationGrid = targetDoc.createElement('div')
  valuationGrid.className = 'grid-2'

  // Estimated Value
  const estimatedValueStat = createStat(targetDoc, 'Estimated Value', formatPriceRange(analysis.estimatedValueMin, analysis.estimatedValueMax), true)
  valuationGrid.appendChild(estimatedValueStat)

  if (analysis.currentRetailPrice) {
    const retailStat = createStat(targetDoc, 'Current Retail', formatPrice(analysis.currentRetailPrice))
    valuationGrid.appendChild(retailStat)
  }

  if (analysis.askingPrice) {
    const askingStat = createStat(targetDoc, 'Asking Price', formatPrice(analysis.askingPrice))
    valuationGrid.appendChild(askingStat)
  }

  if (analysis.dealRating) {
    const dealStat = targetDoc.createElement('div')
    dealStat.className = 'stat'
    const dealLabel = targetDoc.createElement('div')
    dealLabel.className = 'stat-label'
    dealLabel.textContent = 'Deal Rating'
    const dealValue = targetDoc.createElement('div')
    dealValue.className = `deal-rating deal-${analysis.dealRating}`
    dealValue.textContent = formatDealRating(analysis.dealRating)
    dealStat.appendChild(dealLabel)
    dealStat.appendChild(dealValue)
    valuationGrid.appendChild(dealStat)
  }

  valuationSection.appendChild(valuationGrid)

  if (analysis.dealExplanation) {
    const dealExp = targetDoc.createElement('p')
    dealExp.className = 'description'
    dealExp.style.marginTop = '12px'
    dealExp.style.marginBottom = '0'
    dealExp.textContent = analysis.dealExplanation
    valuationSection.appendChild(dealExp)
  }

  container.appendChild(valuationSection)

  // Evidence Section
  if (analysis.evidenceFor?.length || analysis.evidenceAgainst?.length) {
    const evidenceSection = targetDoc.createElement('div')
    evidenceSection.className = 'section'

    const evidenceTitle = targetDoc.createElement('div')
    evidenceTitle.className = 'section-title'
    evidenceTitle.textContent = 'Evidence Analysis'
    evidenceSection.appendChild(evidenceTitle)

    const evidenceGrid = targetDoc.createElement('div')
    evidenceGrid.className = 'grid-2'

    if (analysis.evidenceFor?.length) {
      const forDiv = targetDoc.createElement('div')
      const forLabel = targetDoc.createElement('div')
      forLabel.className = 'stat-label'
      forLabel.style.color = '#28a745'
      forLabel.style.marginBottom = '8px'
      forLabel.textContent = 'Supporting Evidence'
      forDiv.appendChild(forLabel)

      const forList = targetDoc.createElement('ul')
      forList.className = 'evidence-list evidence-for'
      analysis.evidenceFor.forEach(e => {
        const li = targetDoc.createElement('li')
        li.textContent = e
        forList.appendChild(li)
      })
      forDiv.appendChild(forList)
      evidenceGrid.appendChild(forDiv)
    }

    if (analysis.evidenceAgainst?.length) {
      const againstDiv = targetDoc.createElement('div')
      const againstLabel = targetDoc.createElement('div')
      againstLabel.className = 'stat-label'
      againstLabel.style.color = '#dc3545'
      againstLabel.style.marginBottom = '8px'
      againstLabel.textContent = 'Concerns'
      againstDiv.appendChild(againstLabel)

      const againstList = targetDoc.createElement('ul')
      againstList.className = 'evidence-list evidence-against'
      analysis.evidenceAgainst.forEach(e => {
        const li = targetDoc.createElement('li')
        li.textContent = e
        againstList.appendChild(li)
      })
      againstDiv.appendChild(againstList)
      evidenceGrid.appendChild(againstDiv)
    }

    evidenceSection.appendChild(evidenceGrid)
    container.appendChild(evidenceSection)
  }

  // Authentication Section
  if (includeAuthentication && analysis.itemAuthentication) {
    const authSection = targetDoc.createElement('div')
    authSection.className = 'section'

    const authTitle = targetDoc.createElement('div')
    authTitle.className = 'section-title'
    authTitle.textContent = 'Authentication Assessment'
    authSection.appendChild(authTitle)

    const verdictClass = analysis.itemAuthentication.overallVerdict === 'likely_authentic' ? 'auth-authentic'
      : analysis.itemAuthentication.overallVerdict === 'likely_fake' ? 'auth-fake'
      : analysis.itemAuthentication.overallVerdict === 'inconclusive' ? 'auth-inconclusive'
      : 'auth-expert'

    const verdict = targetDoc.createElement('div')
    verdict.className = `auth-verdict ${verdictClass}`
    verdict.textContent = `${formatAuthVerdict(analysis.itemAuthentication.overallVerdict)} (${Math.round(analysis.itemAuthentication.confidenceScore * 100)}% confidence)`
    authSection.appendChild(verdict)

    const authGrid = targetDoc.createElement('div')
    authGrid.className = 'grid-2'
    authGrid.style.marginBottom = '12px'

    const passedStat = createStat(targetDoc, 'Checks Passed', String(analysis.itemAuthentication.passedChecks))
    const passedValue = passedStat.querySelector('.stat-value') as HTMLElement
    if (passedValue) passedValue.style.color = '#28a745'
    authGrid.appendChild(passedStat)

    const failedStat = createStat(targetDoc, 'Checks Failed', String(analysis.itemAuthentication.failedChecks))
    const failedValue = failedStat.querySelector('.stat-value') as HTMLElement
    if (failedValue) failedValue.style.color = '#dc3545'
    authGrid.appendChild(failedStat)

    authSection.appendChild(authGrid)

    if (analysis.itemAuthentication.recommendation) {
      const recommendation = targetDoc.createElement('p')
      recommendation.className = 'description'
      recommendation.style.marginBottom = '0'
      recommendation.textContent = analysis.itemAuthentication.recommendation
      authSection.appendChild(recommendation)
    }

    container.appendChild(authSection)
  }

  // Market Data Section
  if (includeMarketData && analysis.marketIntelligence) {
    const marketSection = targetDoc.createElement('div')
    marketSection.className = 'section'

    const marketTitle = targetDoc.createElement('div')
    marketTitle.className = 'section-title'
    marketTitle.textContent = 'Market Intelligence'
    marketSection.appendChild(marketTitle)

    const marketGrid = targetDoc.createElement('div')
    marketGrid.className = 'grid-2'

    const avgSoldStat = createStat(targetDoc, 'Average Sold Price', formatPrice(analysis.marketIntelligence.averageSoldPrice))
    marketGrid.appendChild(avgSoldStat)

    const demandStat = createStat(targetDoc, 'Market Demand', formatDemandLevel(analysis.marketIntelligence.demandLevel))
    marketGrid.appendChild(demandStat)

    const trendStat = createStat(targetDoc, 'Price Trend', analysis.marketIntelligence.pricetrend)
    marketGrid.appendChild(trendStat)

    const velocityStat = createStat(targetDoc, 'Sales Velocity', analysis.marketIntelligence.salesVelocity)
    marketGrid.appendChild(velocityStat)

    marketSection.appendChild(marketGrid)

    if (analysis.marketIntelligence.bestVenues?.length) {
      const venuesDiv = targetDoc.createElement('div')
      venuesDiv.style.marginTop = '12px'
      const venuesLabel = targetDoc.createElement('div')
      venuesLabel.className = 'stat-label'
      venuesLabel.textContent = 'Best Selling Venues'
      venuesDiv.appendChild(venuesLabel)
      const venuesText = targetDoc.createElement('p')
      venuesText.style.fontSize = '13px'
      venuesText.style.marginTop = '4px'
      venuesText.textContent = analysis.marketIntelligence.bestVenues.join(', ')
      venuesDiv.appendChild(venuesText)
      marketSection.appendChild(venuesDiv)
    }

    container.appendChild(marketSection)
  }

  // Historical Context
  if (analysis.historicalContext) {
    const historySection = targetDoc.createElement('div')
    historySection.className = 'section'

    const historyTitle = targetDoc.createElement('div')
    historyTitle.className = 'section-title'
    historyTitle.textContent = 'Historical Context'
    historySection.appendChild(historyTitle)

    const historyText = targetDoc.createElement('p')
    historyText.className = 'description'
    historyText.style.marginBottom = '0'
    historyText.textContent = analysis.historicalContext
    historySection.appendChild(historyText)

    container.appendChild(historySection)
  }

  // Footer
  const footer = targetDoc.createElement('div')
  footer.className = 'footer'

  const dateDiv = targetDoc.createElement('div')
  dateDiv.textContent = `Generated on ${dateGenerated} by VintageVision AI`
  footer.appendChild(dateDiv)

  const idDiv = targetDoc.createElement('div')
  idDiv.textContent = `Analysis ID: ${analysis.id}`
  footer.appendChild(idDiv)

  const disclaimer = targetDoc.createElement('div')
  disclaimer.className = 'disclaimer'
  disclaimer.textContent = 'This analysis is for informational purposes only. Values are estimates based on AI analysis and comparable market data. For high-value items, we recommend professional appraisal.'
  footer.appendChild(disclaimer)

  container.appendChild(footer)
  targetDoc.body.appendChild(container)
}

/**
 * Export analysis as PDF using browser print dialog
 * Opens a new window with print-optimized content and triggers print
 */
export function exportAnalysisToPDF(
  analysis: ItemAnalysis,
  options: PDFExportOptions = defaultOptions
): void {
  const mergedOptions = { ...defaultOptions, ...options }

  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600')

  if (!printWindow) {
    // Fallback: create iframe if popup blocked
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentDocument
    if (iframeDoc) {
      buildPrintDocument(iframeDoc, analysis, mergedOptions)

      // Wait for images to load before printing
      setTimeout(() => {
        iframe.contentWindow?.print()
        // Remove iframe after print dialog closes
        setTimeout(() => {
          document.body.removeChild(iframe)
        }, 1000)
      }, 500)
    }
    return
  }

  // Build the document in the new window
  buildPrintDocument(printWindow.document, analysis, mergedOptions)

  // Wait for content and images to load, then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  // Fallback if onload doesn't fire
  setTimeout(() => {
    printWindow.print()
  }, 1000)
}

/**
 * Generate shareable text summary of the analysis
 */
export function generateAnalysisSummary(analysis: ItemAnalysis): string {
  const lines: string[] = [
    `${analysis.name}`,
    ''
  ]

  if (analysis.maker) {
    lines.push(`Maker: ${analysis.maker}`)
  }

  if (analysis.era) {
    lines.push(`Era: ${analysis.era}`)
  }

  if (analysis.style) {
    lines.push(`Style: ${analysis.style}`)
  }

  const valueRange = formatPriceRange(analysis.estimatedValueMin, analysis.estimatedValueMax)
  if (valueRange !== 'Value not estimated') {
    lines.push(`Estimated Value: ${valueRange}`)
  }

  lines.push(`Confidence: ${Math.round(analysis.confidence * 100)}%`)

  if (analysis.dealRating) {
    lines.push(`Deal Rating: ${formatDealRating(analysis.dealRating)}`)
  }

  lines.push('')
  lines.push('Analyzed by VintageVision AI')

  return lines.join('\n')
}

/**
 * Check if PDF export is supported (print API available)
 */
export function isPDFExportSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.print === 'function'
}
