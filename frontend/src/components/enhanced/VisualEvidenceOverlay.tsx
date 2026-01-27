// VisualEvidenceOverlay - Display Evidence Markers on Images
// VintageVision v2.0 - World-Class Analysis

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { VisualMarker } from '../../types';

// ============================================================================
// TYPES
// ============================================================================

interface VisualEvidenceOverlayProps {
  imageUrl: string;
  markers: VisualMarker[];
  onMarkerClick?: (marker: VisualMarker) => void;
  className?: string;
  interactive?: boolean;
}

// ============================================================================
// MARKER STYLES
// ============================================================================

function getMarkerStyle(marker: VisualMarker): {
  borderColor: string;
  bgColor: string;
  icon: React.ReactNode;
} {
  if (!marker.isPositive) {
    // Red flags and negative findings
    return {
      borderColor: 'border-red-500',
      bgColor: 'bg-red-500/20',
      icon: <X className="w-3 h-3 text-red-600" />,
    };
  }

  switch (marker.type) {
    case 'maker_mark':
      return {
        borderColor: 'border-emerald-500',
        bgColor: 'bg-emerald-500/20',
        icon: <Check className="w-3 h-3 text-emerald-600" />,
      };
    case 'authentication':
      return {
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-500/20',
        icon: <Check className="w-3 h-3 text-blue-600" />,
      };
    case 'construction':
      return {
        borderColor: 'border-amber-500',
        bgColor: 'bg-amber-500/20',
        icon: <Info className="w-3 h-3 text-amber-600" />,
      };
    case 'damage':
      return {
        borderColor: 'border-orange-500',
        bgColor: 'bg-orange-500/20',
        icon: <AlertTriangle className="w-3 h-3 text-orange-600" />,
      };
    case 'red_flag':
      return {
        borderColor: 'border-red-500',
        bgColor: 'bg-red-500/20',
        icon: <AlertTriangle className="w-3 h-3 text-red-600" />,
      };
    default:
      return {
        borderColor: 'border-stone-500',
        bgColor: 'bg-stone-500/20',
        icon: <Info className="w-3 h-3 text-stone-600" />,
      };
  }
}

// ============================================================================
// MARKER COMPONENT
// ============================================================================

interface MarkerBoxProps {
  marker: VisualMarker;
  isSelected: boolean;
  onClick: () => void;
  showLabels: boolean;
}

function MarkerBox({ marker, isSelected, onClick, showLabels }: MarkerBoxProps) {
  const { borderColor, bgColor, icon } = getMarkerStyle(marker);
  const { x, y, width, height } = marker.bbox;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`absolute cursor-pointer transition-all duration-200 ${
        isSelected ? 'z-20' : 'z-10'
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
      onClick={onClick}
    >
      {/* Bounding box */}
      <div
        className={`absolute inset-0 border-2 ${borderColor} ${bgColor} rounded transition-all ${
          isSelected ? 'border-4 shadow-lg' : ''
        }`}
      />

      {/* Corner indicator */}
      <div
        className={`absolute -top-2 -left-2 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center border ${borderColor}`}
      >
        {icon}
      </div>

      {/* Label */}
      {showLabels && (
        <div
          className={`absolute -bottom-8 left-0 px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-md ${
            marker.isPositive
              ? 'bg-white text-stone-800'
              : 'bg-red-600 text-white'
          }`}
        >
          {marker.label}
        </div>
      )}

      {/* Confidence indicator */}
      {isSelected && (
        <div className="absolute -right-2 -bottom-2 px-1.5 py-0.5 bg-stone-800 text-white text-[10px] rounded">
          {Math.round(marker.confidence * 100)}%
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// DETAIL PANEL
// ============================================================================

interface DetailPanelProps {
  marker: VisualMarker;
  onClose: () => void;
}

function DetailPanel({ marker, onClose }: DetailPanelProps) {
  const { borderColor } = getMarkerStyle(marker);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl border-l-4 ${borderColor} p-4 z-30`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-stone-900">{marker.label}</h4>
        <button
          onClick={onClose}
          className="p-1 hover:bg-stone-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-stone-500" />
        </button>
      </div>

      <p className="text-stone-700 text-sm mb-3">{marker.finding}</p>

      <div className="flex items-center justify-between text-xs">
        <span className="text-stone-500">
          {marker.type.replace('_', ' ').toUpperCase()}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full ${
            marker.isPositive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {marker.isPositive ? 'Supports' : 'Contradicts'} identification
        </span>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function VisualEvidenceOverlay({
  imageUrl,
  markers,
  onMarkerClick,
  className = '',
  interactive = true,
}: VisualEvidenceOverlayProps) {
  const [selectedMarker, setSelectedMarker] = useState<VisualMarker | null>(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMarkerClick = useCallback(
    (marker: VisualMarker) => {
      if (!interactive) return;

      if (selectedMarker?.id === marker.id) {
        setSelectedMarker(null);
      } else {
        setSelectedMarker(marker);
        onMarkerClick?.(marker);
      }
    },
    [selectedMarker, interactive, onMarkerClick]
  );

  const positiveMarkers = markers.filter(m => m.isPositive);
  const negativeMarkers = markers.filter(m => !m.isPositive);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Image */}
      <motion.img
        src={imageUrl}
        alt="Item with evidence markers"
        className={`w-full h-auto transition-transform duration-300 ${
          isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
        }`}
        onClick={() => interactive && setIsZoomed(!isZoomed)}
        layoutId="evidence-image"
      />

      {/* Markers overlay */}
      <AnimatePresence>
        {showMarkers &&
          markers.map((marker) => (
            <MarkerBox
              key={marker.id}
              marker={marker}
              isSelected={selectedMarker?.id === marker.id}
              onClick={() => handleMarkerClick(marker)}
              showLabels={showLabels}
            />
          ))}
      </AnimatePresence>

      {/* Selected marker detail panel */}
      <AnimatePresence>
        {selectedMarker && (
          <DetailPanel
            marker={selectedMarker}
            onClose={() => setSelectedMarker(null)}
          />
        )}
      </AnimatePresence>

      {/* Controls */}
      {interactive && (
        <div className="absolute top-3 right-3 flex gap-2">
          {/* Toggle markers */}
          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className={`p-2 rounded-lg shadow-md transition-colors ${
              showMarkers
                ? 'bg-amber-500 text-white'
                : 'bg-white/90 text-stone-600 hover:bg-white'
            }`}
            title={showMarkers ? 'Hide markers' : 'Show markers'}
          >
            {showMarkers ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          {/* Toggle labels */}
          {showMarkers && (
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`p-2 rounded-lg shadow-md transition-colors ${
                showLabels
                  ? 'bg-white text-amber-600'
                  : 'bg-white/90 text-stone-400 hover:bg-white'
              }`}
              title={showLabels ? 'Hide labels' : 'Show labels'}
            >
              <Info className="w-4 h-4" />
            </button>
          )}

          {/* Zoom */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 bg-white/90 text-stone-600 rounded-lg shadow-md hover:bg-white transition-colors"
            title={isZoomed ? 'Zoom out' : 'Zoom in'}
          >
            {isZoomed ? (
              <ZoomOut className="w-4 h-4" />
            ) : (
              <ZoomIn className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* Legend */}
      {interactive && markers.length > 0 && (
        <div className="absolute bottom-3 left-3 flex gap-3 text-xs">
          {positiveMarkers.length > 0 && (
            <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full shadow-sm">
              <Check className="w-3 h-3 text-green-600" />
              <span className="text-stone-700">
                {positiveMarkers.length} supporting
              </span>
            </div>
          )}
          {negativeMarkers.length > 0 && (
            <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full shadow-sm">
              <AlertTriangle className="w-3 h-3 text-red-600" />
              <span className="text-stone-700">
                {negativeMarkers.length} concern{negativeMarkers.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MINI VERSION (for thumbnails)
// ============================================================================

interface MiniEvidenceOverlayProps {
  imageUrl: string;
  markers: VisualMarker[];
  className?: string;
}

export function MiniEvidenceOverlay({
  imageUrl,
  markers,
  className = '',
}: MiniEvidenceOverlayProps) {
  const positiveCount = markers.filter(m => m.isPositive).length;
  const negativeCount = markers.filter(m => !m.isPositive).length;

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <img
        src={imageUrl}
        alt="Item thumbnail"
        className="w-full h-full object-cover"
      />

      {/* Simplified markers (just dots) */}
      {markers.slice(0, 5).map((marker) => (
        <div
          key={marker.id}
          className={`absolute w-2 h-2 rounded-full ${
            marker.isPositive ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{
            left: `${marker.bbox.x + marker.bbox.width / 2}%`,
            top: `${marker.bbox.y + marker.bbox.height / 2}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Count badge */}
      {markers.length > 0 && (
        <div className="absolute bottom-1 right-1 flex gap-1">
          {positiveCount > 0 && (
            <span className="bg-green-500 text-white text-[10px] px-1 rounded">
              +{positiveCount}
            </span>
          )}
          {negativeCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1 rounded">
              -{negativeCount}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default VisualEvidenceOverlay;
