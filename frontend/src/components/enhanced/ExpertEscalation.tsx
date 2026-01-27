// ExpertEscalation - Connect with Certified Experts
// VintageVision v2.0 - World-Class Analysis

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  MapPin,
  Star,
  ExternalLink,
  Mail,
  Calendar,
  DollarSign,
  Shield,
  Clock,
  ChevronRight,
  X,
} from 'lucide-react';
import { DomainExpert, getDomainExpertName } from '../../types';

// ============================================================================
// TYPES
// ============================================================================

interface Expert {
  id: string;
  name: string;
  title: string;
  specialty: DomainExpert;
  credentials: string[];
  location: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  priceRange: string;
  imageUrl?: string;
  verified: boolean;
}

interface ExpertEscalationProps {
  itemName: string;
  domainExpert: DomainExpert;
  estimatedValue?: number;
  onClose: () => void;
  className?: string;
}

// ============================================================================
// MOCK EXPERTS (Would be from API in production)
// ============================================================================

const MOCK_EXPERTS: Expert[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    title: 'Certified Appraiser, ASA',
    specialty: 'furniture',
    credentials: ['ASA Accredited Senior Appraiser', '25+ years experience', 'Antique Traders Association'],
    location: 'New York, NY',
    rating: 4.9,
    reviewCount: 127,
    responseTime: '< 24 hours',
    priceRange: '$75-150',
    verified: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'NAWCC Certified Watchmaker',
    specialty: 'watches',
    credentials: ['NAWCC Certified', 'Rolex Service Center Trained', '15+ years experience'],
    location: 'Los Angeles, CA',
    rating: 4.8,
    reviewCount: 89,
    responseTime: '< 48 hours',
    priceRange: '$50-200',
    verified: true,
  },
  {
    id: '3',
    name: 'Jennifer Walsh',
    title: 'GIA Graduate Gemologist',
    specialty: 'jewelry',
    credentials: ['GIA Graduate Gemologist', 'AGS Certified', 'Estate Jewelry Specialist'],
    location: 'Chicago, IL',
    rating: 5.0,
    reviewCount: 203,
    responseTime: '< 24 hours',
    priceRange: '$100-300',
    verified: true,
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface ExpertCardProps {
  expert: Expert;
  onContact: () => void;
}

function ExpertCard({ expert, onContact }: ExpertCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-stone-200 p-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xl font-serif">
            {expert.name.split(' ').map(n => n[0]).join('')}
          </div>
          {expert.verified && (
            <div className="flex items-center justify-center -mt-2">
              <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Shield className="w-2.5 h-2.5" />
                Verified
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-stone-900">{expert.name}</h4>
          <p className="text-sm text-amber-700">{expert.title}</p>

          <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {expert.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              {expert.rating} ({expert.reviewCount})
            </span>
          </div>

          {/* Credentials */}
          <div className="flex flex-wrap gap-1 mt-2">
            {expert.credentials.slice(0, 2).map((cred, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full"
              >
                {cred}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
        <div className="flex gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {expert.responseTime}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {expert.priceRange}
          </span>
        </div>

        <button
          onClick={onContact}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
        >
          Contact
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ExpertEscalation({
  itemName,
  domainExpert,
  estimatedValue,
  onClose,
  className = '',
}: ExpertEscalationProps) {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  // Filter experts by domain
  const relevantExperts = MOCK_EXPERTS.filter(
    e => e.specialty === domainExpert || e.specialty === 'general'
  );

  // Add some general experts if not enough domain-specific ones
  const displayExperts = relevantExperts.length >= 2
    ? relevantExperts
    : [...relevantExperts, ...MOCK_EXPERTS.slice(0, 3 - relevantExperts.length)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${className}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-to-b from-amber-50 to-stone-100 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif text-amber-900">
                Connect with an Expert
              </h2>
              <p className="text-sm text-amber-700 mt-1">
                Get a professional opinion on your {itemName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-amber-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-amber-800" />
            </button>
          </div>

          {/* Value context */}
          {estimatedValue && (
            <div className="mt-4 p-3 bg-amber-100 rounded-lg text-sm">
              <span className="text-amber-800">
                For items valued at{' '}
                <strong>
                  ${(estimatedValue / 100).toLocaleString()}+
                </strong>
                , professional authentication is recommended before purchase.
              </span>
            </div>
          )}
        </div>

        {/* Expert list */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="font-medium text-stone-800">
              {getDomainExpertName(domainExpert)} Specialists
            </h3>
          </div>

          {displayExperts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onContact={() => setSelectedExpert(expert)}
            />
          ))}

          {/* Can't find expert */}
          <div className="text-center py-4 text-stone-500 text-sm">
            <p>Can't find the right expert?</p>
            <button className="text-amber-600 hover:text-amber-700 font-medium mt-1">
              Request a custom match
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200 text-center text-xs text-stone-500">
          All experts are independently verified. VintageVision does not take a commission.
        </div>
      </motion.div>

      {/* Contact modal */}
      <AnimatePresence>
        {selectedExpert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-60"
            onClick={() => setSelectedExpert(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-semibold text-lg text-stone-900 mb-2">
                Contact {selectedExpert.name}
              </h3>
              <p className="text-sm text-stone-600 mb-4">
                Choose how you'd like to reach out:
              </p>

              <div className="space-y-3">
                <a
                  href={`mailto:expert@vintagevision.space?subject=Authentication Request: ${encodeURIComponent(itemName)}`}
                  className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <Mail className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="font-medium text-stone-800">Email</div>
                    <div className="text-xs text-stone-500">
                      Response within {selectedExpert.responseTime}
                    </div>
                  </div>
                </a>

                <button className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors w-full text-left">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="font-medium text-stone-800">
                      Schedule Consultation
                    </div>
                    <div className="text-xs text-stone-500">
                      Video call or in-person
                    </div>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors w-full text-left">
                  <ExternalLink className="w-5 h-5 text-amber-600" />
                  <div>
                    <div className="font-medium text-stone-800">
                      View Full Profile
                    </div>
                    <div className="text-xs text-stone-500">
                      See reviews and portfolio
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setSelectedExpert(null)}
                className="w-full mt-4 py-2 text-stone-500 hover:text-stone-700 text-sm"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ExpertEscalation;
