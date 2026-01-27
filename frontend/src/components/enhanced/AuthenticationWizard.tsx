import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  Shield, ShieldCheck, ShieldAlert, Camera, CheckCircle2, XCircle,
  ChevronRight, ChevronLeft, AlertTriangle, FileText, Upload, X, Loader2
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import {
  ItemAnalysis,
  PhotoRequest,
  getAuthenticityRiskColor,
  getAuthenticityRiskLabel,
  getCheckPriorityColor,
  getPhotoPriorityColor,
  formatConfidence
} from '@/types'

interface AuthenticationWizardProps {
  analysis: ItemAnalysis
  onClose: () => void
  onSubmitPhotos?: (photos: { photoRequest: PhotoRequest; imageData: string }[]) => Promise<void>
}

type WizardStep = 'overview' | 'checklist' | 'photos' | 'report'

export default function AuthenticationWizard({
  analysis,
  onClose,
  onSubmitPhotos
}: AuthenticationWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('overview')
  const [checklistState, setChecklistState] = useState<Record<string, {
    completed: boolean
    result?: 'pass' | 'fail' | 'uncertain'
    notes?: string
  }>>({})
  const [photoSubmissions, setPhotoSubmissions] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    authenticationConfidence,
    authenticityRisk,
    authenticationChecklist,
    knownFakeIndicators,
    additionalPhotosRequested,
    expertReferralRecommended,
    authenticationAssessment,
    name
  } = analysis

  // Calculate progress
  const completedChecks = Object.values(checklistState).filter(c => c.completed).length
  const totalChecks = authenticationChecklist?.length || 0
  const checklistProgress = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0

  const submittedPhotos = Object.keys(photoSubmissions).length
  const requiredPhotos = additionalPhotosRequested?.filter(p => p.priority === 'required').length || 0
  const totalPhotoRequests = additionalPhotosRequested?.length || 0

  // Handle check toggle
  const handleCheckToggle = (checkId: string, result: 'pass' | 'fail' | 'uncertain') => {
    setChecklistState(prev => ({
      ...prev,
      [checkId]: {
        ...prev[checkId],
        completed: true,
        result
      }
    }))
  }

  // Handle photo capture
  const handlePhotoCapture = useCallback((photoId: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setPhotoSubmissions(prev => ({
          ...prev,
          [photoId]: dataUrl
        }))
      }
      reader.readAsDataURL(file)
    }

    input.click()
  }, [])

  // Handle submit
  const handleSubmit = async () => {
    if (!additionalPhotosRequested) {
      toast.error('No photos to submit')
      return
    }

    if (!onSubmitPhotos) {
      // Photo submission not configured - just proceed to report
      toast.info('Photo analysis not available, proceeding to report')
      setCurrentStep('report')
      return
    }

    setIsSubmitting(true)
    try {
      const photos = additionalPhotosRequested
        .filter(p => photoSubmissions[p.id])
        .map(p => ({
          photoRequest: p,
          imageData: photoSubmissions[p.id]
        }))

      if (photos.length === 0) {
        toast.warning('No photos uploaded yet')
        setIsSubmitting(false)
        return
      }

      await onSubmitPhotos(photos)
      toast.success('Photos submitted successfully')
      setCurrentStep('report')
    } catch (error) {
      console.error('Failed to submit photos:', error)
      toast.error('Failed to submit photos. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Steps navigation
  const steps: { id: WizardStep; label: string; icon: typeof Shield }[] = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'checklist', label: 'Checklist', icon: CheckCircle2 },
    { id: 'photos', label: 'Photos', icon: Camera },
    { id: 'report', label: 'Report', icon: FileText }
  ]

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id)
    }
  }

  const goPrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-wizard-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard className="overflow-hidden" >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-border/50 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="p-2 sm:p-3 bg-white rounded-xl shadow-sm" aria-hidden="true">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <h2 id="auth-wizard-title" className="text-base sm:text-xl font-bold text-foreground">Authentication</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close authentication wizard"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Step Progress - Mobile optimized */}
            <div className="flex items-center justify-between mt-4 sm:mt-6 overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                      currentStep === step.id
                        ? 'bg-blue-600 text-white'
                        : index < currentStepIndex
                        ? 'bg-green-100 text-green-700'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <step.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="font-medium">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground mx-1 sm:mx-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-200px)] sm:max-h-[calc(90vh-250px)]">
            <AnimatePresence mode="wait">
              {currentStep === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Risk Level */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      {authenticityRisk === 'low' ? (
                        <ShieldCheck className="w-8 h-8 text-green-500" />
                      ) : authenticityRisk === 'very_high' ? (
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                      ) : (
                        <Shield className="w-8 h-8 text-amber-500" />
                      )}
                      <div>
                        <div className="font-semibold text-foreground">Counterfeit Risk Level</div>
                        <div className={`text-sm ${getAuthenticityRiskColor(authenticityRisk).split(' ')[0]}`}>
                          {getAuthenticityRiskLabel(authenticityRisk)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">
                        {formatConfidence(authenticationConfidence)}
                      </div>
                      <div className="text-xs text-muted-foreground">Auth Confidence</div>
                    </div>
                  </div>

                  {/* Assessment */}
                  {authenticationAssessment && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{authenticationAssessment}</p>
                      </div>
                    </div>
                  )}

                  {/* Known Fake Indicators */}
                  {knownFakeIndicators && knownFakeIndicators.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        What Fakes of This Item Show
                      </h3>
                      <div className="grid gap-2">
                        {knownFakeIndicators.map((indicator, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expert Referral */}
                  {expertReferralRecommended && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <h4 className="font-semibold text-amber-800 mb-1">Expert Referral Recommended</h4>
                      <p className="text-sm text-amber-700">
                        For items of this value and complexity, we recommend professional authentication before purchase.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {currentStep === 'checklist' && (
                <motion.div
                  key="checklist"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Checklist Progress</span>
                      <span className="text-sm font-bold text-foreground">{checklistProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${checklistProgress}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Checklist Items */}
                  {authenticationChecklist?.map((check, index) => (
                    <motion.div
                      key={check.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border ${
                        checklistState[check.id]?.completed
                          ? checklistState[check.id]?.result === 'pass'
                            ? 'bg-green-50 border-green-200'
                            : checklistState[check.id]?.result === 'fail'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-yellow-50 border-yellow-200'
                          : 'bg-white border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCheckPriorityColor(check.priority)}`}>
                              {check.priority}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">{check.category}</span>
                            {check.photoHelpful && (
                              <Camera className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                          <h4 className="font-semibold text-foreground mb-1">{check.check}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{check.howTo}</p>

                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div className="p-2 bg-green-50 rounded-lg">
                              <div className="font-medium text-green-700 mb-1">Look for:</div>
                              <div className="text-green-600">{check.whatToLookFor}</div>
                            </div>
                            <div className="p-2 bg-red-50 rounded-lg">
                              <div className="font-medium text-red-700 mb-1">Red flags:</div>
                              <ul className="text-red-600 list-disc list-inside">
                                {check.redFlagSigns.slice(0, 2).map((flag, i) => (
                                  <li key={i} className="text-xs">{flag}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleCheckToggle(check.id, 'pass')}
                            className={`p-2 rounded-lg transition-colors ${
                              checklistState[check.id]?.result === 'pass'
                                ? 'bg-green-500 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleCheckToggle(check.id, 'fail')}
                            className={`p-2 rounded-lg transition-colors ${
                              checklistState[check.id]?.result === 'fail'
                                ? 'bg-red-500 text-white'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleCheckToggle(check.id, 'uncertain')}
                            className={`p-2 rounded-lg transition-colors ${
                              checklistState[check.id]?.result === 'uncertain'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                          >
                            <AlertTriangle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {currentStep === 'photos' && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Photos Submitted</span>
                      <span className="text-sm font-bold text-foreground">
                        {submittedPhotos} / {totalPhotoRequests}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: totalPhotoRequests > 0 ? `${(submittedPhotos / totalPhotoRequests) * 100}%` : '0%' }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {requiredPhotos} required photos, {totalPhotoRequests - requiredPhotos} recommended
                    </p>
                  </div>

                  {/* Photo Requests */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {additionalPhotosRequested?.map((photo, index) => (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl border ${getPhotoPriorityColor(photo.priority)}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                              photo.priority === 'required' ? 'bg-red-100 text-red-700' :
                              photo.priority === 'recommended' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {photo.priority}
                            </span>
                          </div>
                          {photoSubmissions[photo.id] && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                        </div>

                        <h4 className="font-semibold text-foreground mb-1 capitalize">{photo.area}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{photo.reason}</p>
                        <p className="text-xs text-muted-foreground mb-4">{photo.whatToCapture}</p>

                        {photoSubmissions[photo.id] ? (
                          <div className="relative">
                            <img
                              src={photoSubmissions[photo.id]}
                              alt={photo.area}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => setPhotoSubmissions(prev => {
                                const updated = { ...prev }
                                delete updated[photo.id]
                                return updated
                              })}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handlePhotoCapture(photo.id)}
                            className="w-full py-3 border-2 border-dashed border-border rounded-lg flex items-center justify-center gap-2 text-muted-foreground hover:border-blue-400 hover:text-blue-600 transition-colors"
                          >
                            <Upload className="w-5 h-5" />
                            <span className="text-sm font-medium">Upload Photo</span>
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 'report' && (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <ShieldCheck className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Authentication Complete</h3>
                    <p className="text-muted-foreground">
                      Review your authentication results below
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl text-center">
                      <div className="text-3xl font-bold text-blue-600">{completedChecks}/{totalChecks}</div>
                      <div className="text-sm text-blue-700">Checks Completed</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl text-center">
                      <div className="text-3xl font-bold text-purple-600">{submittedPhotos}</div>
                      <div className="text-sm text-purple-700">Photos Submitted</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {formatConfidence(authenticationConfidence)}
                      </div>
                      <div className="text-sm text-green-700">Auth Confidence</div>
                    </div>
                  </div>

                  {/* Passed/Failed Checks */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Passed Checks
                      </h4>
                      <ul className="space-y-1">
                        {authenticationChecklist?.filter(c => checklistState[c.id]?.result === 'pass').map(c => (
                          <li key={c.id} className="text-sm text-green-700">{c.check}</li>
                        ))}
                        {Object.values(checklistState).filter(c => c.result === 'pass').length === 0 && (
                          <li className="text-sm text-green-600 italic">No checks marked as passed yet</li>
                        )}
                      </ul>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Failed/Uncertain Checks
                      </h4>
                      <ul className="space-y-1">
                        {authenticationChecklist?.filter(c =>
                          checklistState[c.id]?.result === 'fail' || checklistState[c.id]?.result === 'uncertain'
                        ).map(c => (
                          <li key={c.id} className="text-sm text-red-700">
                            {c.check} ({checklistState[c.id]?.result})
                          </li>
                        ))}
                        {Object.values(checklistState).filter(c => c.result === 'fail' || c.result === 'uncertain').length === 0 && (
                          <li className="text-sm text-red-600 italic">No concerns identified</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="p-3 sm:p-6 border-t border-border/50 bg-muted/50/50 flex items-center justify-between gap-2">
            <button
              onClick={goPrev}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              {currentStep === 'photos' && submittedPhotos > 0 && (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span className="hidden sm:inline">Submit for Analysis</span>
                      <span className="sm:hidden">Submit</span>
                    </>
                  )}
                </button>
              )}

              {currentStep !== 'report' && (
                <button
                  onClick={goNext}
                  className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  {currentStep === 'photos' ? 'Report' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 'report' && (
                <button
                  onClick={onClose}
                  className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  Done
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
