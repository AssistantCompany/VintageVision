/**
 * Vera Assistant - Interactive AI Chat Component
 * VintageVision - World-Leading Antique AI as of January 2026
 *
 * "Vera" (Latin for "truth") is the VintageVision interactive assistant
 * that guides users through providing additional information to achieve
 * higher confidence authentication scores.
 *
 * Redesigned January 2026 for better UX and usability.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Send, X, Info, CheckCircle } from 'lucide-react';

// Types matching backend
interface InformationNeed {
  id: string;
  type: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  question: string;
  explanation: string;
  expectedConfidenceGain: number;
  photoGuidance?: string;
  examples?: string[];
}

interface ConversationMessage {
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: string;
  relatedNeedId?: string;
}

interface ConfidenceProgress {
  timestamp: string;
  overallConfidence: number;
  reason: string;
}

interface InteractiveSession {
  id: string;
  informationNeeds: InformationNeed[];
  conversationHistory: ConversationMessage[];
  confidenceProgress: ConfidenceProgress[];
  status: 'gathering_info' | 'processing' | 'complete' | 'abandoned';
}

interface VeraAssistantProps {
  session: InteractiveSession | null;
  onSendMessage: (needId: string, type: 'photo' | 'text', content: string) => void;
  onRequestReanalysis: () => void;
  isLoading?: boolean;
  className?: string;
}

export function VeraAssistant({
  session,
  onSendMessage,
  onRequestReanalysis,
  isLoading = false,
  className = '',
}: VeraAssistantProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.conversationHistory]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!session) {
    return (
      <div className={`bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <div>
            <h3 className="text-amber-900 font-semibold text-lg">Vera</h3>
            <p className="text-amber-700 text-sm">Authentication Assistant</p>
          </div>
        </div>
        <p className="text-amber-800">Loading session...</p>
      </div>
    );
  }

  // Find current unanswered need (for targeted questions)
  const answeredNeedIds = new Set(
    session.conversationHistory
      .filter(msg => msg.role === 'user' && msg.relatedNeedId)
      .map(msg => msg.relatedNeedId)
  );

  const currentNeed = session.informationNeeds.find(
    need => !answeredNeedIds.has(need.id)
  );

  const remainingNeeds = session.informationNeeds.filter(
    need => !answeredNeedIds.has(need.id)
  );

  const confidenceProgress = session.confidenceProgress;
  const latestConfidence = confidenceProgress[confidenceProgress.length - 1]?.overallConfidence ?? 0;
  const initialConfidence = confidenceProgress[0]?.overallConfidence ?? 0;
  const improvement = latestConfidence - initialConfidence;

  // Handle sending text - use currentNeed.id if available, otherwise generate one
  const handleSendText = () => {
    if (!inputValue.trim()) return;

    const needId = currentNeed?.id || `user-text-${Date.now()}`;
    onSendMessage(needId, 'text', inputValue.trim());
    setInputValue('');
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  // Handle sending photo
  const handleSendPhoto = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const needId = currentNeed?.id || `user-photo-${Date.now()}`;
        onSendMessage(needId, 'photo', reader.result as string);
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  // Cancel selected photo
  const handleCancelPhoto = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Vera</h3>
              <p className="text-amber-100 text-sm">Authentication Assistant</p>
            </div>
          </div>

          {/* Confidence Display */}
          <div className="text-right">
            <div className="text-amber-100 text-xs uppercase tracking-wide">Confidence</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {(latestConfidence * 100).toFixed(0)}%
              </span>
              {improvement > 0.01 && (
                <span className="text-green-200 text-sm font-medium">
                  +{(improvement * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500 rounded-full"
            style={{ width: `${latestConfidence * 100}%` }}
          />
        </div>
      </div>

      {/* Quick Info Banner */}
      {remainingNeeds.length > 0 && session.status === 'gathering_info' && (
        <div className="bg-amber-50 px-4 py-3 border-b border-amber-200">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="text-amber-800 font-medium">
                {remainingNeeds.length} question{remainingNeeds.length > 1 ? 's' : ''} remaining
              </span>
              <span className="text-amber-600 ml-1">
                — answer below or add photos to improve accuracy
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/50">
        {session.conversationHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-amber-500 text-white rounded-br-md'
                  : 'bg-white shadow-sm border border-border rounded-bl-md'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">V</span>
                  </div>
                  <span className="text-amber-700 text-sm font-semibold">Vera</span>
                </div>
              )}
              <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
                message.role === 'user' ? 'text-white' : 'text-muted-foreground'
              }`}>
                {formatMessageContent(message.content, message.role === 'user')}
              </div>
              <div className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-amber-200' : 'text-muted-foreground'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm border border-border rounded-2xl rounded-bl-md p-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-muted-foreground text-sm">Vera is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Current Question Highlight */}
      {currentNeed && session.status === 'gathering_info' && (
        <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-200">
          <div className="flex items-start gap-3">
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityStyles(currentNeed.priority)}`}>
              {currentNeed.priority}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-amber-900 font-medium text-sm truncate">
                {currentNeed.type.includes('photo') ? '📷 Photo requested' : '💬 Question'}
              </p>
              {currentNeed.photoGuidance && (
                <p className="text-amber-700 text-xs mt-1">{currentNeed.photoGuidance}</p>
              )}
            </div>
            <div className="text-amber-600 text-xs">
              +{(currentNeed.expectedConfidenceGain * 100).toFixed(0)}% potential
            </div>
          </div>
        </div>
      )}

      {/* Photo Preview */}
      {previewUrl && (
        <div className="px-4 py-3 bg-muted border-t border-border">
          <div className="flex items-center gap-3">
            <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{selectedFile?.name}</p>
              <p className="text-xs text-muted-foreground">Ready to send</p>
            </div>
            <button
              onClick={handleCancelPhoto}
              className="p-2 text-muted-foreground hover:text-muted-foreground hover:bg-muted/80 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendPhoto}
              disabled={isLoading}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Photo
            </button>
          </div>
        </div>
      )}

      {/* Input Area - Always visible when gathering info */}
      {session.status === 'gathering_info' && !previewUrl && (
        <div className="p-4 border-t border-border bg-white">
          <div className="flex items-center gap-2">
            {/* Photo Upload Button - Always visible */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-3 bg-muted hover:bg-muted/80 text-muted-foreground rounded-xl transition-colors disabled:opacity-50"
              title="Add Photo"
            >
              <Camera className="w-5 h-5" />
            </button>

            {/* Text Input - Always enabled */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response or add a photo..."
                disabled={isLoading}
                className="w-full bg-muted rounded-xl px-4 py-3 text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:bg-white transition-all disabled:opacity-50"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendText}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:bg-gray-300"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Help text */}
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Share photos of marks, labels, or details • Type answers to questions
          </p>
        </div>
      )}

      {/* Processing State - Ready to reanalyze */}
      {session.status === 'processing' && (
        <div className="p-4 border-t border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-800">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium">Information collected!</span>
            </div>
            <button
              onClick={onRequestReanalysis}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Reanalyze with New Info</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Complete State */}
      {session.status === 'complete' && (
        <div className="p-4 border-t border-green-200 bg-green-50">
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Analysis complete!</p>
              <p className="text-sm text-green-600">
                Confidence improved to {(latestConfidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to format message content with basic styling
function formatMessageContent(content: string, isUser: boolean): React.ReactNode {
  if (isUser) return content;

  // Parse markdown-like formatting for Vera's messages
  return content.split('\n').map((line, i) => {
    // Bold headers
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <p key={i} className="font-bold text-amber-800 mt-2">
          {line.slice(2, -2)}
        </p>
      );
    }
    // Italic notes
    if (line.startsWith('_') && line.endsWith('_')) {
      return (
        <p key={i} className="italic text-muted-foreground text-sm">
          {line.slice(1, -1)}
        </p>
      );
    }
    // Key-value pairs like "- **Key:** Value"
    const kvMatch = line.match(/^- \*\*(.+?):\*\* (.+)$/);
    if (kvMatch) {
      return (
        <p key={i} className="ml-2">
          <span className="font-semibold text-amber-700">{kvMatch[1]}:</span>{' '}
          <span className="text-muted-foreground">{kvMatch[2]}</span>
        </p>
      );
    }
    // Photo tips
    if (line.startsWith('**Photo tip:**')) {
      return (
        <div key={i} className="flex items-start gap-2 bg-blue-50 p-2 rounded-lg mt-2 border border-blue-100">
          <Camera className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <span className="text-blue-700 text-sm">{line.replace('**Photo tip:**', '').trim()}</span>
        </div>
      );
    }
    // Regular text or empty line
    return line ? <p key={i}>{line}</p> : <br key={i} />;
  });
}

export default VeraAssistant;
