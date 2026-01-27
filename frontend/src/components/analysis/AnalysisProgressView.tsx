/**
 * AnalysisProgressView Component
 * Award-winning loading experience with micro-interactions
 * January 2026 - Transformative UX for AI analysis
 */

import { motion, AnimatePresence } from 'framer-motion'
import { AnalysisProgress, AnalysisStage } from '@/hooks/useAnalysisStream'
import { cn } from '@/lib/utils'

interface AnalysisProgressViewProps {
  progress: AnalysisProgress
  imagePreview?: string
  onCancel?: () => void
}

// Stage configuration
const STAGES: Array<{
  id: AnalysisStage
  label: string
  icon: string
  description: string
}> = [
  { id: 'upload', label: 'Upload', icon: '📤', description: 'Preparing image' },
  { id: 'triage', label: 'Categorize', icon: '🔍', description: 'Identifying type' },
  { id: 'evidence', label: 'Examine', icon: '🔬', description: 'Finding details' },
  { id: 'candidates', label: 'Match', icon: '🎯', description: 'Expert matching' },
  { id: 'analysis', label: 'Analyze', icon: '✨', description: 'Final report' },
]

// Domain-specific educational facts
const DOMAIN_FACTS: Record<string, string[]> = {
  watches: [
    "Vintage Rolex watches have increased in value by 300% over the past decade.",
    "The 'tropical dial' effect on vintage watches is highly prized by collectors.",
    "Watch movements can contain over 300 individual components.",
    "Original boxes and papers can add 20-40% to a vintage watch's value.",
    "The patina on watch dials develops uniquely based on UV exposure and humidity.",
  ],
  furniture: [
    "Original finish on antique furniture can add 50% or more to its value.",
    "Dovetail joints changed from hand-cut (pre-1860s) to machine-cut, helping date pieces.",
    "The wood shrinkage pattern can reveal if furniture is genuinely old.",
    "Mid-century modern pieces from the 1950s-60s are now highly collectible.",
    "Original hardware and pulls significantly impact a piece's value.",
  ],
  ceramics: [
    "The underside marks on porcelain can reveal the exact factory and date.",
    "Crazing (fine cracks in glaze) can indicate age but may reduce value.",
    "Chinese export porcelain was specifically made for Western markets.",
    "Wedgwood's jasperware colors each have different rarity and values.",
    "Hand-painted details vs. transfer prints greatly affect ceramic values.",
  ],
  jewelry: [
    "Victorian mourning jewelry often contained real hair of the deceased.",
    "The 'Georgian' era (pre-1837) jewelry is extremely rare and valuable.",
    "Art Deco jewelry (1920s-30s) features bold geometric designs.",
    "Hallmarks can pinpoint exactly when and where jewelry was made.",
    "Natural pearls are worth significantly more than cultured pearls.",
  ],
  art: [
    "Provenance (ownership history) can multiply an artwork's value many times.",
    "UV light can reveal restorations and repairs invisible to the naked eye.",
    "Original frames can be worth thousands on their own.",
    "Artist signatures evolved over their careers, helping authenticate works.",
    "Even minor artists from famous movements can be highly valuable.",
  ],
  silver: [
    "Sterling silver is 92.5% pure silver - hallmarks prove authenticity.",
    "Georgian silver (pre-1830) commands premium prices.",
    "Silver plate vs. solid silver: magnetic testing is a quick identifier.",
    "Tiffany & Co. silver pieces have appreciated 400% since the 1990s.",
    "The weight of silver pieces directly correlates with their melt value.",
  ],
  glass: [
    "Carnival glass gets its iridescence from metallic salt sprays.",
    "Depression glass was given away free during the 1930s - now collectible.",
    "Murano glass from Venice has been prized for over 700 years.",
    "UV light makes certain glass types fluoresce, helping identification.",
    "Pontil marks on the base indicate hand-blown vs. machine-made glass.",
  ],
  electronics: [
    "Original Nintendo Game Boys from 1989 can sell for $200+ in good condition.",
    "Sony Walkman TPS-L2 (1979) - the first portable cassette player - is highly collectible.",
    "Vintage electronics with original packaging are worth 2-3x more.",
    "CRT televisions are making a comeback among retro gaming collectors.",
    "The condition of rubber buttons and battery compartments greatly affects value.",
  ],
  toys: [
    "Vintage Star Wars figures in original packaging can be worth thousands.",
    "Hot Wheels Redlines (1968-1977) are the most valuable die-cast cars.",
    "Barbie dolls from the early 1960s in mint condition fetch premium prices.",
    "Original Teddy Bears by Steiff with button-in-ear are highly prized.",
    "Board games with all original pieces intact are increasingly collectible.",
  ],
  textiles: [
    "Navajo rugs can be dated by their weaving patterns and dye types.",
    "Victorian crazy quilts often contain hidden messages and memorial pieces.",
    "Vintage designer clothing labels changed over decades, helping with dating.",
    "Silk kimonos from the Meiji period (1868-1912) are museum-quality.",
    "Original condition matters more than cleaning for antique textiles.",
  ],
  books: [
    "First editions of classic novels can be worth hundreds of thousands.",
    "The dust jacket often represents 80% of a rare book's value.",
    "Signed books are worth more if the author is deceased.",
    "Book club editions are usually worth much less than first printings.",
    "Ex-library books have reduced value due to stamps and labels.",
  ],
  tools: [
    "Stanley planes from the early 1900s are prized by woodworkers.",
    "Vintage hand tools often outperform modern equivalents.",
    "Patent dates on tools help establish manufacturing periods.",
    "Wooden-handled tools with original finishes command premium prices.",
    "Specialized trade tools (cooper's, wheelwright's) are increasingly rare.",
  ],
  lighting: [
    "Tiffany lamps can range from $5,000 to over $1 million.",
    "Original Tiffany shades are signed - look for 'Tiffany Studios New York'.",
    "Art Deco lamps from the 1920s-30s feature geometric chrome designs.",
    "Rewired vintage lamps are acceptable - originality matters for the fixture.",
    "Handel and Pairpoint lamps are often mistaken for Tiffany.",
  ],
  vehicles: [
    "Matching numbers (original engine) dramatically increases car values.",
    "Barn find patina is now prized - some collectors prefer unrestored.",
    "Documentation and service records add 10-20% to a vehicle's value.",
    "Limited production runs create rarity that drives collector interest.",
    "Original paint, even worn, can be more valuable than a respray.",
  ],
  default: [
    "The term 'antique' typically refers to items over 100 years old.",
    "Maker's marks are like fingerprints - each tells a unique story.",
    "Patina is the natural aging that collectors prize highly.",
    "Authentication experts can spot fakes by microscopic details.",
    "Provenance can double or triple an item's value.",
  ],
}

// Get domain-specific fact based on identified domain
function getDomainFact(domain: string | undefined, elapsedTime: number): string {
  const facts = DOMAIN_FACTS[domain?.toLowerCase() || ''] || DOMAIN_FACTS.default
  return facts[Math.floor(elapsedTime / 10) % facts.length]
}

export function AnalysisProgressView({
  progress,
  imagePreview,
  onCancel,
}: AnalysisProgressViewProps) {
  const currentStageIndex = STAGES.findIndex(s => s.id === progress.stage)
  const identifiedDomain = progress.stageData.triage?.domain
  const domainFact = getDomainFact(identifiedDomain, progress.elapsedTime)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-card to-background backdrop-blur-sm safe-area-top safe-area-bottom">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Main Card */}
        <div className="bg-card/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-border">
          {/* Header with Image Preview */}
          <div className="relative h-32 bg-gradient-to-r from-primary via-brass-light to-primary overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full bg-white"
                  initial={{ x: Math.random() * 400, y: Math.random() * 128 }}
                  animate={{
                    x: Math.random() * 400,
                    y: Math.random() * 128,
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Image preview thumbnail */}
            {imagePreview && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="absolute -bottom-8 left-6"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                  <img
                    src={imagePreview}
                    alt="Analyzing"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            )}

            {/* Title */}
            <div className="absolute bottom-4 right-6 text-right">
              <h2 className="text-white font-bold text-xl">Analyzing Your Item</h2>
              <p className="text-amber-100 text-sm">Expert AI identification in progress</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="p-6 pt-12">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">
                  {progress.message}
                </span>
                <span className="text-sm font-bold text-primary">
                  {progress.progress}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-brass-light to-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Stage Indicators - Mobile optimized */}
            <div className="flex justify-between mb-4 sm:mb-6 overflow-x-auto">
              {STAGES.map((stage, index) => {
                const isComplete = progress.completedStages.includes(stage.id)
                const isCurrent = progress.stage === stage.id
                const isPending = index > currentStageIndex

                return (
                  <motion.div
                    key={stage.id}
                    className="flex flex-col items-center flex-shrink-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Icon Circle */}
                    <motion.div
                      className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-lg transition-all duration-300",
                        isComplete && "bg-success text-white",
                        isCurrent && "bg-primary text-primary-foreground ring-2 sm:ring-4 ring-primary/30",
                        isPending && "bg-muted text-muted-foreground"
                      )}
                      animate={isCurrent ? {
                        scale: [1, 1.1, 1],
                      } : {}}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {isComplete ? (
                        <motion.span
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", bounce: 0.5 }}
                        >
                          ✓
                        </motion.span>
                      ) : (
                        stage.icon
                      )}
                    </motion.div>

                    {/* Label */}
                    <span className={cn(
                      "text-xs mt-1.5 font-medium",
                      isComplete && "text-success",
                      isCurrent && "text-primary",
                      isPending && "text-muted-foreground"
                    )}>
                      {stage.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            {/* Partial Results Preview */}
            <AnimatePresence mode="wait">
              {progress.stageData.triage && (
                <motion.div
                  key="triage-preview"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="bg-warning-muted rounded-xl p-4 border border-warning/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🏷️</span>
                      <span className="font-semibold text-foreground">Identified Category</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-warning">Type:</span>{' '}
                        <span className="font-medium text-foreground">{progress.stageData.triage.itemType}</span>
                      </div>
                      <div>
                        <span className="text-warning">Domain:</span>{' '}
                        <span className="font-medium text-foreground capitalize">{progress.stageData.triage.domain}</span>
                      </div>
                      {progress.stageData.triage.era && (
                        <div className="col-span-2">
                          <span className="text-warning">Era:</span>{' '}
                          <span className="font-medium text-foreground">{progress.stageData.triage.era}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {progress.stageData.candidates && progress.stageData.candidates.length > 0 && (
                <motion.div
                  key="candidates-preview"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="bg-success-muted rounded-xl p-4 border border-success/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🎯</span>
                      <span className="font-semibold text-foreground">Top Match</span>
                    </div>
                    <p className="font-medium text-foreground mb-1">
                      {progress.stageData.candidates[0].name}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-success">
                        {Math.round(progress.stageData.candidates[0].confidence * 100)}% confidence
                      </span>
                      {progress.stageData.candidates[0].value &&
                        (progress.stageData.candidates[0].value.low != null || progress.stageData.candidates[0].value.high != null) && (
                        <span className="text-success font-medium">
                          ${progress.stageData.candidates[0].value.low?.toLocaleString() ?? 'N/A'} - ${progress.stageData.candidates[0].value.high?.toLocaleString() ?? 'N/A'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Educational Content (for longer waits) */}
            {progress.elapsedTime > 10 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-info-muted rounded-xl p-4 border border-info/30 mb-4"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <span className="font-semibold text-foreground text-sm">Did you know?</span>
                    <p className="text-foreground/80 text-sm mt-1">{domainFact}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Timer and Cancel */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-mono">{formatTime(progress.elapsedTime)}</span> elapsed
              </div>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="text-sm text-muted-foreground hover:text-danger transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-20 w-40 h-40 bg-brass-light/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default AnalysisProgressView
