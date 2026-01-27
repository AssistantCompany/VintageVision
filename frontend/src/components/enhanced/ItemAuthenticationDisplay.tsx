// ItemAuthenticationDisplay - Item-Specific Authentication Results
// VintageVision v2.0 - World-Class Analysis

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ShieldX,
  ShieldQuestion,
  AlertTriangle,
  Check,
  X,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  User,
} from 'lucide-react';
import {
  ItemAuthentication,
  AuthenticationFinding,
  getAuthVerdictStyle,
  getFindingStatusColor,
} from '../../types';

// ============================================================================
// TYPES
// ============================================================================

interface ItemAuthenticationDisplayProps {
  authentication: ItemAuthentication;
  itemName: string;
  onFindingClick?: (finding: AuthenticationFinding) => void;
  onExpertRequest?: () => void;
  className?: string;
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface VerdictBadgeProps {
  verdict: ItemAuthentication['overallVerdict'];
  confidence: number;
}

function VerdictBadge({ verdict, confidence }: VerdictBadgeProps) {
  const style = getAuthVerdictStyle(verdict);

  const Icon = {
    likely_authentic: ShieldCheck,
    likely_fake: ShieldX,
    inconclusive: ShieldQuestion,
    needs_expert: Shield,
  }[verdict];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${style.color}`}
    >
      <Icon className="w-8 h-8" />
      <div>
        <div className="font-semibold text-lg">{style.label}</div>
        <div className="text-sm opacity-80">
          {Math.round(confidence * 100)}% confidence
        </div>
      </div>
    </div>
  );
}

interface FindingCardProps {
  finding: AuthenticationFinding;
  onClick?: () => void;
}

function FindingCard({ finding, onClick }: FindingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusColor = getFindingStatusColor(finding.status);

  const StatusIcon = {
    pass: Check,
    fail: X,
    inconclusive: HelpCircle,
    needs_verification: AlertTriangle,
  }[finding.status];

  return (
    <motion.div
      layout
      className={`border rounded-lg overflow-hidden ${statusColor}`}
    >
      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
          onClick?.();
        }}
        className="w-full p-3 flex items-start gap-3 text-left"
      >
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
            finding.status === 'pass'
              ? 'bg-green-500'
              : finding.status === 'fail'
              ? 'bg-red-500'
              : finding.status === 'inconclusive'
              ? 'bg-yellow-500'
              : 'bg-blue-500'
          }`}
        >
          <StatusIcon className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-stone-900">{finding.area}</span>
            <span className="text-xs text-stone-500">
              {Math.round(finding.confidence * 100)}%
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-0.5">{finding.observation}</p>
        </div>

        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-stone-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-stone-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-current/10 overflow-hidden"
          >
            <div className="p-3 bg-white/50">
              <div className="text-sm space-y-2">
                <div>
                  <span className="font-medium text-stone-700">Expected for:</span>
                  <p className="text-stone-600">{finding.expectedFor}</p>
                </div>
                <div>
                  <span className="font-medium text-stone-700">Assessment:</span>
                  <p className="text-stone-600">{finding.explanation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ItemAuthenticationDisplay({
  authentication,
  itemName,
  onFindingClick,
  onExpertRequest,
  className = '',
}: ItemAuthenticationDisplayProps) {
  const [showAllFindings, setShowAllFindings] = useState(false);

  const displayedFindings = showAllFindings
    ? authentication.findings
    : authentication.findings.slice(0, 5);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-stone-100">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-amber-600" />
          <h3 className="font-serif text-lg text-stone-900">
            Authentication Analysis
          </h3>
        </div>

        {/* Verdict */}
        <VerdictBadge
          verdict={authentication.overallVerdict}
          confidence={authentication.confidenceScore}
        />

        {/* Summary stats */}
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-stone-600">
              {authentication.passedChecks} passed
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-stone-600">
              {authentication.failedChecks} failed
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-stone-600">
              {authentication.inconclusiveChecks} uncertain
            </span>
          </div>
        </div>
      </div>

      {/* Critical issues alert */}
      {authentication.criticalIssues.length > 0 && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Critical Concerns</h4>
              <ul className="mt-2 space-y-1">
                {authentication.criticalIssues.map((issue, idx) => (
                  <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="text-red-400">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Findings */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-stone-700 mb-3">
          Specific Findings for This {itemName}
        </h4>

        <div className="space-y-2">
          {displayedFindings.map((finding) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              onClick={() => onFindingClick?.(finding)}
            />
          ))}
        </div>

        {authentication.findings.length > 5 && (
          <button
            onClick={() => setShowAllFindings(!showAllFindings)}
            className="w-full mt-3 py-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            {showAllFindings
              ? 'Show fewer'
              : `Show ${authentication.findings.length - 5} more findings`}
          </button>
        )}
      </div>

      {/* Recommendation */}
      <div className="p-4 bg-stone-50 border-t border-stone-100">
        <h4 className="text-sm font-medium text-stone-700 mb-2">
          Recommendation
        </h4>
        <p className="text-stone-600">{authentication.recommendation}</p>

        {/* Expert referral */}
        {authentication.expertNeeded && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="font-medium text-purple-900">
                  Expert Review Recommended
                </h5>
                {authentication.expertType && (
                  <p className="text-sm text-purple-700 mt-1">
                    Suggested: {authentication.expertType}
                  </p>
                )}
                {onExpertRequest && (
                  <button
                    onClick={onExpertRequest}
                    className="mt-3 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                  >
                    Find an Expert
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPACT VERSION
// ============================================================================

interface CompactAuthenticationProps {
  authentication: ItemAuthentication;
  className?: string;
}

export function CompactAuthentication({
  authentication,
  className = '',
}: CompactAuthenticationProps) {
  const style = getAuthVerdictStyle(authentication.overallVerdict);

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${style.color} ${className}`}
    >
      <Shield className="w-4 h-4" />
      <span className="text-sm font-medium">{style.label}</span>
      <span className="text-xs opacity-70">
        ({Math.round(authentication.confidenceScore * 100)}%)
      </span>
    </div>
  );
}

export default ItemAuthenticationDisplay;
