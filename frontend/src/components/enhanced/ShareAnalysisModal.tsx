import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Copy,
  Check,
  Link2,
  Mail,
  MessageCircle,
  FileText,
  Share2,
  QrCode,
  ExternalLink
} from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'
import LiquidButton from '@/components/ui/LiquidButton'
import { ItemAnalysis, formatPriceRange } from '@/types'
import { cn, copyToClipboard, shareContent, isWebShareSupported, trackEvent } from '@/lib/utils'
import { exportAnalysisToPDF, generateAnalysisSummary } from '@/utils/pdfExport'

// Twitter/X icon component
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

// Facebook icon component
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

// Pinterest icon component
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
)

interface ShareAnalysisModalProps {
  analysis: ItemAnalysis
  isOpen: boolean
  onClose: () => void
}

export default function ShareAnalysisModal({
  analysis,
  isOpen,
  onClose
}: ShareAnalysisModalProps) {
  const [copied, setCopied] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  // Generate share URL
  const shareUrl = `${window.location.origin}/analysis/${analysis.id}`

  // Generate share text
  const valueText = analysis.estimatedValueMin && analysis.estimatedValueMax
    ? `worth ${formatPriceRange(analysis.estimatedValueMin, analysis.estimatedValueMax)}`
    : ''

  const shareTitle = `Check out this ${analysis.name}!`
  const shareText = `I discovered this ${analysis.name} ${analysis.era ? `from the ${analysis.era}` : ''} ${valueText} using VintageVision AI!`

  // Generate QR code URL using a free QR API
  useEffect(() => {
    if (showQRCode) {
      // Using goqr.me API for QR code generation
      const encodedUrl = encodeURIComponent(shareUrl)
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&bgcolor=ffffff&color=8b5a2b`)
    }
  }, [showQRCode, shareUrl])

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(shareUrl)
      setCopied(true)
      trackEvent('share_link_copied', { itemName: analysis.name })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback handled silently
    }
  }

  const handleNativeShare = async () => {
    trackEvent('share_native', { itemName: analysis.name })
    try {
      await shareContent({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      })
    } catch {
      // User cancelled or share failed
      await handleCopyLink()
    }
  }

  const handleEmailShare = () => {
    trackEvent('share_email', { itemName: analysis.name })
    const subject = encodeURIComponent(shareTitle)
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self')
  }

  const handleTwitterShare = () => {
    trackEvent('share_twitter', { itemName: analysis.name })
    const text = encodeURIComponent(`${shareText} ${analysis.dealRating === 'exceptional' ? '(Great deal!)' : ''}`)
    const url = encodeURIComponent(shareUrl)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=550,height=420')
  }

  const handleFacebookShare = () => {
    trackEvent('share_facebook', { itemName: analysis.name })
    const url = encodeURIComponent(shareUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=420')
  }

  const handlePinterestShare = () => {
    trackEvent('share_pinterest', { itemName: analysis.name })
    const url = encodeURIComponent(shareUrl)
    const media = encodeURIComponent(analysis.imageUrl)
    const description = encodeURIComponent(shareText)
    window.open(`https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${description}`, '_blank', 'width=750,height=550')
  }

  const handleSMSShare = () => {
    trackEvent('share_sms', { itemName: analysis.name })
    const body = encodeURIComponent(`${shareTitle}\n${shareText}\n${shareUrl}`)
    // iOS uses & for body, Android uses ?
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    window.open(`sms:${isIOS ? '&' : '?'}body=${body}`, '_self')
  }

  const handlePDFExport = () => {
    trackEvent('share_pdf_export', { itemName: analysis.name })
    exportAnalysisToPDF(analysis)
  }

  const handleCopyFullSummary = async () => {
    try {
      const summary = generateAnalysisSummary(analysis)
      await copyToClipboard(`${summary}\n\n${shareUrl}`)
      setCopied(true)
      trackEvent('share_summary_copied', { itemName: analysis.name })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback handled silently
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="p-6" gradient="warm">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Share Analysis</h3>
                    <p className="text-sm text-gray-500">{analysis.name}</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Copy Link Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Link
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 px-3 py-2 bg-white/50 border border-gray-300/50 rounded-xl text-sm text-gray-700 truncate">
                    {shareUrl}
                  </div>
                  <MagneticButton
                    onClick={handleCopyLink}
                    variant={copied ? 'primary' : 'glass'}
                    size="md"
                    className={cn(
                      'transition-colors',
                      copied && 'bg-green-500 text-white'
                    )}
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </MagneticButton>
                </div>
              </div>

              {/* Native Share Button (Mobile) */}
              {isWebShareSupported() && (
                <LiquidButton
                  onClick={handleNativeShare}
                  variant="primary"
                  size="md"
                  className="w-full mb-4"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share...</span>
                </LiquidButton>
              )}

              {/* Social Share Buttons */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Share on Social Media
                </label>
                <div className="grid grid-cols-4 gap-3">
                  <motion.button
                    onClick={handleTwitterShare}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/50 border border-gray-200/50 hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <TwitterIcon className="w-5 h-5" />
                    <span className="text-xs text-gray-600">X</span>
                  </motion.button>

                  <motion.button
                    onClick={handleFacebookShare}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/50 border border-gray-200/50 hover:bg-blue-50 transition-colors"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FacebookIcon className="w-5 h-5 text-blue-600" />
                    <span className="text-xs text-gray-600">Facebook</span>
                  </motion.button>

                  <motion.button
                    onClick={handlePinterestShare}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/50 border border-gray-200/50 hover:bg-red-50 transition-colors"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PinterestIcon className="w-5 h-5 text-red-600" />
                    <span className="text-xs text-gray-600">Pinterest</span>
                  </motion.button>

                  <motion.button
                    onClick={handleEmailShare}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/50 border border-gray-200/50 hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-xs text-gray-600">Email</span>
                  </motion.button>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="space-y-2">
                <motion.button
                  onClick={handleSMSShare}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-gray-200/50 hover:bg-gray-50 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Send via Text Message</span>
                </motion.button>

                <motion.button
                  onClick={handleCopyFullSummary}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-gray-200/50 hover:bg-gray-50 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <Link2 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Copy Full Summary</span>
                </motion.button>

                <motion.button
                  onClick={handlePDFExport}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-gray-200/50 hover:bg-gray-50 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-gray-700">Export as PDF</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </motion.button>

                <motion.button
                  onClick={() => setShowQRCode(!showQRCode)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-gray-200/50 hover:bg-gray-50 transition-colors text-left"
                  whileHover={{ x: 4 }}
                >
                  <QrCode className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                  </span>
                </motion.button>
              </div>

              {/* QR Code Display */}
              <AnimatePresence>
                {showQRCode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="QR Code for sharing"
                          className="w-48 h-48"
                        />
                      ) : (
                        <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-gray-400">Loading...</span>
                        </div>
                      )}
                      <p className="mt-2 text-xs text-gray-500 text-center">
                        Scan to view this analysis
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
