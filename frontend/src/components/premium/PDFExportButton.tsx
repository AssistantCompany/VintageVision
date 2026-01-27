/**
 * PDFExportButton - Premium Feature
 * Generates professional PDF reports for insurance and resale
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Loader2, Crown, Lock } from 'lucide-react'
import { ItemAnalysis } from '@/types'

interface PDFExportButtonProps {
  analysis: ItemAnalysis
  isPremium?: boolean
  onUpgradeClick?: () => void
}

export default function PDFExportButton({
  analysis,
  isPremium = false,
  onUpgradeClick
}: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    if (!isPremium) {
      onUpgradeClick?.()
      return
    }

    setIsGenerating(true)

    try {
      // Dynamic import of jsPDF to reduce initial bundle size
      const { default: jsPDF } = await import('jspdf')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 20
      let yPos = 20

      // Header with logo area
      pdf.setFillColor(59, 130, 246) // Blue header
      pdf.rect(0, 0, pageWidth, 40, 'F')

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(24)
      pdf.setFont('helvetica', 'bold')
      pdf.text('VintageVision', margin, 25)

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Professional Appraisal Report', margin, 33)

      // Report ID and Date
      pdf.setFontSize(8)
      const reportId = `VV-${Date.now().toString(36).toUpperCase()}`
      pdf.text(`Report ID: ${reportId}`, pageWidth - margin - 40, 25)
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, 31)

      yPos = 50

      // Reset text color
      pdf.setTextColor(0, 0, 0)

      // Item Name - Large title
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      const itemName = analysis.name || 'Unidentified Item'
      pdf.text(itemName, margin, yPos)
      yPos += 10

      // Confidence badge
      const confidence = Math.round((analysis.confidence || 0) * 100)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Identification Confidence: ${confidence}%`, margin, yPos)
      yPos += 15

      // Divider line
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 10

      // Two column layout for key details
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(11)

      const leftCol = margin
      const rightCol = pageWidth / 2 + 10

      // Left column - Identification
      pdf.setFont('helvetica', 'bold')
      pdf.text('IDENTIFICATION', leftCol, yPos)
      yPos += 7

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)

      const details = [
        ['Category', analysis.productCategory || 'N/A'],
        ['Era', analysis.era || 'Unknown'],
        ['Style', analysis.style || 'N/A'],
        ['Origin', analysis.originRegion || 'Unknown'],
        ['Maker', analysis.maker || 'Unattributed'],
      ]

      details.forEach(([label, value]) => {
        pdf.setTextColor(100, 100, 100)
        pdf.text(`${label}:`, leftCol, yPos)
        pdf.setTextColor(0, 0, 0)
        pdf.text(String(value), leftCol + 25, yPos)
        yPos += 6
      })

      // Right column - Valuation (start from same Y as left column started)
      let rightYPos = yPos - (details.length * 6) - 7

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(11)
      pdf.text('VALUATION', rightCol, rightYPos)
      rightYPos += 7

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)

      // Value range
      const minVal = analysis.estimatedValueMin
      const maxVal = analysis.estimatedValueMax
      const valueStr = minVal && maxVal
        ? `$${minVal.toLocaleString()} - $${maxVal.toLocaleString()}`
        : 'Valuation pending'

      pdf.setTextColor(100, 100, 100)
      pdf.text('Estimated Value:', rightCol, rightYPos)
      rightYPos += 6
      pdf.setTextColor(34, 139, 34) // Green for value
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text(valueStr, rightCol, rightYPos)
      rightYPos += 10

      pdf.setTextColor(0, 0, 0)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)

      // Deal explanation or valuation context
      if (analysis.dealExplanation) {
        pdf.setTextColor(100, 100, 100)
        const basisLines = pdf.splitTextToSize(analysis.dealExplanation, 70)
        pdf.text(basisLines, rightCol, rightYPos)
      }

      yPos += 15

      // Description section
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, yPos, pageWidth - margin, yPos)
      yPos += 10

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(11)
      pdf.setTextColor(0, 0, 0)
      pdf.text('DESCRIPTION', margin, yPos)
      yPos += 7

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      const descLines = pdf.splitTextToSize(analysis.description || 'No description available', pageWidth - 2 * margin)
      pdf.text(descLines, margin, yPos)
      yPos += descLines.length * 5 + 10

      // Historical Context
      if (analysis.historicalContext) {
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(11)
        pdf.text('HISTORICAL CONTEXT', margin, yPos)
        yPos += 7

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(10)
        const histLines = pdf.splitTextToSize(analysis.historicalContext, pageWidth - 2 * margin)
        pdf.text(histLines, margin, yPos)
        yPos += histLines.length * 5 + 10
      }

      // Evidence section
      const hasEvidence = (analysis.evidenceFor?.length || 0) > 0 || (analysis.evidenceAgainst?.length || 0) > 0
      if (hasEvidence) {
        pdf.setDrawColor(200, 200, 200)
        pdf.line(margin, yPos, pageWidth - margin, yPos)
        yPos += 10

        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(11)
        pdf.text('AUTHENTICATION EVIDENCE', margin, yPos)
        yPos += 7

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9)

        // Supporting evidence
        if (analysis.evidenceFor?.length) {
          pdf.setTextColor(34, 139, 34)
          pdf.text('Supporting:', margin, yPos)
          yPos += 5
          pdf.setTextColor(0, 0, 0)
          analysis.evidenceFor.slice(0, 3).forEach((evidence: string) => {
            pdf.text(`  + ${evidence}`, margin, yPos)
            yPos += 4
          })
          yPos += 3
        }

        // Conflicting evidence
        if (analysis.evidenceAgainst?.length) {
          pdf.setTextColor(220, 53, 69)
          pdf.text('Requires Verification:', margin, yPos)
          yPos += 5
          pdf.setTextColor(0, 0, 0)
          analysis.evidenceAgainst.slice(0, 3).forEach((evidence: string) => {
            pdf.text(`  - ${evidence}`, margin, yPos)
            yPos += 4
          })
        }
      }

      // Footer
      const footerY = pdf.internal.pageSize.getHeight() - 20
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5)

      pdf.setFontSize(8)
      pdf.setTextColor(128, 128, 128)
      pdf.text('This report is generated by VintageVision AI analysis.', margin, footerY)
      pdf.text('For insurance purposes, professional in-person appraisal is recommended.', margin, footerY + 4)
      pdf.text(`Generated: ${new Date().toISOString()}`, pageWidth - margin - 50, footerY)
      pdf.text('vintagevision.space', pageWidth - margin - 50, footerY + 4)

      // Save the PDF
      const fileName = `VintageVision-${itemName.replace(/[^a-z0-9]/gi, '-')}-${reportId}.pdf`
      pdf.save(fileName)

    } catch (error) {
      console.error('PDF generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
        transition-all duration-200
        ${isPremium
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
          : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : isPremium ? (
        <>
          <FileText className="w-4 h-4" />
          Export PDF Report
        </>
      ) : (
        <>
          <Lock className="w-4 h-4" />
          <span>PDF Report</span>
          <Crown className="w-3 h-3 text-amber-500" />
        </>
      )}
    </motion.button>
  )
}
