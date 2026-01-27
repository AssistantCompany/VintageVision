import { motion } from 'framer-motion'
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Camera, CheckCircle2, XCircle, UserCheck } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import {
  ItemAnalysis,
  AuthenticityRisk,
  getAuthenticityRiskColor,
  getAuthenticityRiskLabel,
  formatConfidence
} from '@/types'

interface AuthenticationSectionProps {
  analysis: ItemAnalysis
  onStartAuthentication?: () => void
}

export default function AuthenticationSection({ analysis, onStartAuthentication }: AuthenticationSectionProps) {
  const {
    authenticationConfidence,
    authenticityRisk,
    authenticationChecklist,
    knownFakeIndicators,
    additionalPhotosRequested,
    expertReferralRecommended,
    expertReferralReason,
    authenticationAssessment,
  } = analysis

  // Get the appropriate shield icon based on risk level
  const getShieldIcon = (risk: AuthenticityRisk | null) => {
    switch (risk) {
      case 'low':
        return <ShieldCheck className="w-8 h-8 text-green-500" />
      case 'medium':
        return <Shield className="w-8 h-8 text-yellow-500" />
      case 'high':
      case 'very_high':
        return <ShieldAlert className="w-8 h-8 text-red-500" />
      default:
        return <Shield className="w-8 h-8 text-muted-foreground" />
    }
  }

  // Calculate critical checks count
  const criticalChecks = authenticationChecklist?.filter(c => c.priority === 'critical').length || 0
  const totalChecks = authenticationChecklist?.length || 0
  const requiredPhotos = additionalPhotosRequested?.filter(p => p.priority === 'required').length || 0

  // Get confidence color
  const getConfidenceColor = (confidence: number | null) => {
    if (confidence === null) return 'text-muted-foreground'
    if (confidence >= 0.8) return 'text-success'
    if (confidence >= 0.6) return 'text-warning'
    if (confidence >= 0.4) return 'text-warning'
    return 'text-danger'
  }

  return (
    <GlassCard className="overflow-hidden" >
      {/* Header with Risk Badge */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="p-3 bg-white/80 rounded-2xl shadow-sm"
            >
              {getShieldIcon(authenticityRisk)}
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Authentication Status</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Counterfeit risk assessment and verification guidance
              </p>
            </div>
          </div>

          {/* Risk Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`px-4 py-2 rounded-xl border font-semibold text-sm ${getAuthenticityRiskColor(authenticityRisk)}`}
          >
            {getAuthenticityRiskLabel(authenticityRisk)}
          </motion.div>
        </div>
      </div>

      {/* Confidence Meters */}
      <div className="p-6 grid md:grid-cols-2 gap-6 border-b border-border/50">
        {/* Authentication Confidence */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Authentication Confidence</span>
            <span className={`text-lg font-bold ${getConfidenceColor(authenticationConfidence)}`}>
              {formatConfidence(authenticationConfidence)}
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(authenticationConfidence || 0) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`h-full rounded-full ${
                (authenticationConfidence || 0) >= 0.8 ? 'bg-green-500' :
                (authenticationConfidence || 0) >= 0.6 ? 'bg-yellow-500' :
                (authenticationConfidence || 0) >= 0.4 ? 'bg-orange-500' : 'bg-red-500'
              }`}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {(authenticationConfidence || 0) >= 0.8 ? 'High confidence this is authentic' :
             (authenticationConfidence || 0) >= 0.6 ? 'Moderate confidence, verification recommended' :
             (authenticationConfidence || 0) >= 0.4 ? 'Low confidence, expert examination needed' :
             'Very low confidence, significant concerns'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{criticalChecks}</div>
            <div className="text-xs text-muted-foreground">Critical Checks</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{totalChecks}</div>
            <div className="text-xs text-muted-foreground">Total Checks</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{requiredPhotos}</div>
            <div className="text-xs text-muted-foreground">Photos Needed</div>
          </div>
        </div>
      </div>

      {/* Assessment Summary */}
      {authenticationAssessment && (
        <div className="p-6 border-b border-border/50 bg-gradient-to-r from-info-muted/50 to-accent/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
            <p className="text-muted-foreground leading-relaxed">{authenticationAssessment}</p>
          </div>
        </div>
      )}

      {/* Expert Referral Warning */}
      {expertReferralRecommended && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mx-6 mt-6 bg-amber-50 border border-amber-200 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800">Expert Authentication Recommended</h4>
              <p className="text-sm text-amber-700 mt-1">
                {expertReferralReason || 'Due to the value and complexity of this item, professional authentication is recommended before purchase.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Known Fake Indicators */}
      {knownFakeIndicators && knownFakeIndicators.length > 0 && (
        <div className="p-6 border-b border-border/50">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Known Fake Indicators for This Item
          </h4>
          <div className="space-y-2">
            {knownFakeIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-2 text-sm"
              >
                <span className="w-1.5 h-1.5 bg-danger/60 rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{indicator}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Checklist Preview */}
      {authenticationChecklist && authenticationChecklist.length > 0 && (
        <div className="p-6 border-b border-border/50">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Authentication Checklist Preview
          </h4>
          <div className="space-y-2">
            {authenticationChecklist.slice(0, 4).map((check, index) => (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
              >
                <div className={`w-2 h-2 rounded-full ${
                  check.priority === 'critical' ? 'bg-red-500' :
                  check.priority === 'important' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
                <span className="text-sm text-muted-foreground flex-1">{check.check}</span>
                {check.photoHelpful && (
                  <Camera className="w-4 h-4 text-muted-foreground" />
                )}
              </motion.div>
            ))}
            {authenticationChecklist.length > 4 && (
              <p className="text-sm text-muted-foreground pl-5">
                +{authenticationChecklist.length - 4} more checks available
              </p>
            )}
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div className="p-6">
        <motion.button
          onClick={onStartAuthentication}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-shadow flex items-center justify-center gap-3"
        >
          <Shield className="w-5 h-5" />
          Start Full Authentication
          {requiredPhotos > 0 && (
            <span className="px-2 py-0.5 bg-white/20 rounded-lg text-sm">
              {requiredPhotos} photos needed
            </span>
          )}
        </motion.button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Complete the verification checklist and submit additional photos for deeper analysis
        </p>
      </div>
    </GlassCard>
  )
}
