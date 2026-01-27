// HonestConfidenceDisplay - Transparent Knowledge Communication
// VintageVision v2.0 - World-Class Analysis

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  HelpCircle,
  Camera,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
  Sparkles,
} from 'lucide-react';
import {
  KnowledgeState,
  ConfirmedFact,
  ProbableFact,
  VerificationNeed,
  CaptureRequest,
  getKnowledgeLabel,
  getCapturePriorityColor,
  getImageRoleLabel,
} from '../../types';

// ============================================================================
// TYPES
// ============================================================================

interface HonestConfidenceDisplayProps {
  knowledgeState: KnowledgeState;
  suggestedCaptures?: CaptureRequest[];
  onCaptureRequest?: (request: CaptureRequest) => void;
  className?: string;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface ConfirmedFactCardProps {
  fact: ConfirmedFact;
  index: number;
}

function ConfirmedFactCard({ fact, index }: ConfirmedFactCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
        <Check className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-green-900">{fact.statement}</p>
        <p className="text-sm text-green-700 mt-1">{fact.evidence}</p>
      </div>
    </motion.div>
  );
}

interface ProbableFactCardProps {
  fact: ProbableFact;
  index: number;
}

function ProbableFactCard({ fact, index }: ProbableFactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
    >
      <div
        className="flex gap-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-amber-900">{fact.statement}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                {Math.round(fact.confidence * 100)}% likely
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-amber-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-amber-500" />
              )}
            </div>
          </div>
          <p className="text-sm text-amber-700 mt-1">{fact.evidence}</p>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-amber-200"
          >
            <div className="flex items-start gap-2 text-sm">
              <Target className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-amber-800">To confirm:</span>
                <p className="text-amber-700">{fact.howToConfirm}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface VerificationNeedCardProps {
  need: VerificationNeed;
  index: number;
  onCaptureRequest?: () => void;
}

function VerificationNeedCard({
  need,
  index,
  onCaptureRequest,
}: VerificationNeedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-blue-900">{need.question}</p>
          <p className="text-sm text-blue-700 mt-1">{need.photoNeeded}</p>

          <div className="flex items-center justify-between mt-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                need.importance === 'critical'
                  ? 'bg-red-100 text-red-700'
                  : need.importance === 'important'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {need.importance}
            </span>

            {onCaptureRequest && (
              <button
                onClick={onCaptureRequest}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <Camera className="w-4 h-4" />
                Add Photo
              </button>
            )}
          </div>

          {need.impactOnValue && (
            <p className="text-xs text-blue-600 mt-2 italic">
              {need.impactOnValue}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function HonestConfidenceDisplay({
  knowledgeState,
  suggestedCaptures,
  onCaptureRequest,
  className = '',
}: HonestConfidenceDisplayProps) {
  const [activeTab, setActiveTab] = useState<'confirmed' | 'probable' | 'needed'>(
    'confirmed'
  );

  const { label, color } = getKnowledgeLabel(knowledgeState.completeness);

  const tabs = [
    {
      id: 'confirmed' as const,
      label: 'Confirmed',
      count: knowledgeState.confirmed.length,
      icon: Check,
      color: 'text-green-600',
    },
    {
      id: 'probable' as const,
      label: 'Probable',
      count: knowledgeState.probable.length,
      icon: Lightbulb,
      color: 'text-amber-600',
    },
    {
      id: 'needed' as const,
      label: 'Needs Info',
      count: knowledgeState.needsVerification.length,
      icon: HelpCircle,
      color: 'text-blue-600',
    },
  ];

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-lg text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            What We Know
          </h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
            {label}
          </div>
        </div>

        {/* Completeness bar */}
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${knowledgeState.completeness * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-stone-500 mt-1">
          {Math.round(knowledgeState.completeness * 100)}% knowledge completeness
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? tab.color
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-current/10'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {tab.count}
              </span>
            )}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-current"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'confirmed' && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {knowledgeState.confirmed.length > 0 ? (
                knowledgeState.confirmed.map((fact, idx) => (
                  <ConfirmedFactCard key={idx} fact={fact} index={idx} />
                ))
              ) : (
                <div className="text-center py-8 text-stone-400">
                  <Check className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No facts confirmed yet</p>
                  <p className="text-sm">Add more photos to increase confidence</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'probable' && (
            <motion.div
              key="probable"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {knowledgeState.probable.length > 0 ? (
                knowledgeState.probable.map((fact, idx) => (
                  <ProbableFactCard key={idx} fact={fact} index={idx} />
                ))
              ) : (
                <div className="text-center py-8 text-stone-400">
                  <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>All findings are confirmed</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'needed' && (
            <motion.div
              key="needed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {knowledgeState.needsVerification.length > 0 ? (
                knowledgeState.needsVerification.map((need, idx) => (
                  <VerificationNeedCard
                    key={idx}
                    need={need}
                    index={idx}
                    onCaptureRequest={
                      onCaptureRequest
                        ? () =>
                            onCaptureRequest({
                              role: 'additional',
                              priority: need.importance === 'critical' ? 'required' : 'recommended',
                              label: need.question,
                              instruction: need.photoNeeded,
                            })
                        : undefined
                    }
                  />
                ))
              ) : (
                <div className="text-center py-8 text-stone-400">
                  <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No additional information needed</p>
                  <p className="text-sm">Analysis is complete</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggested captures */}
      {suggestedCaptures && suggestedCaptures.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-stone-100">
          <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-500" />
            Photos That Would Help
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {suggestedCaptures.map((capture, idx) => (
              <button
                key={idx}
                onClick={() => onCaptureRequest?.(capture)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${getCapturePriorityColor(
                  capture.priority
                )} hover:shadow-md`}
              >
                <span className="block text-stone-800">{capture.label}</span>
                <span className="block text-xs text-stone-500 mt-0.5">
                  {getImageRoleLabel(capture.role)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPACT VERSION
// ============================================================================

interface CompactConfidenceProps {
  knowledgeState: KnowledgeState;
  className?: string;
}

export function CompactConfidence({
  knowledgeState,
  className = '',
}: CompactConfidenceProps) {
  const { label, color } = getKnowledgeLabel(knowledgeState.completeness);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1">
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-blue-500"
            style={{ width: `${knowledgeState.completeness * 100}%` }}
          />
        </div>
      </div>
      <span className={`text-sm font-medium whitespace-nowrap ${color}`}>
        {label}
      </span>
    </div>
  );
}

export default HonestConfidenceDisplay;
