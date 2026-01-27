import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  X,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Palette,
  ShieldCheck,
  Edit3,
  Save,
  Trash2
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils'
import { useNotifications } from '@/components/enhanced/NotificationSystem'

interface CollectionItem {
  id: string
  item_analysis_id: string
  name: string
  era?: string
  style?: string
  description: string
  estimated_value_min?: number
  estimated_value_max?: number
  image_url: string
  notes?: string
  location?: string
  saved_at: string
  confidence: number
}

interface CollectionItemDetailModalProps {
  item: CollectionItem | null
  isOpen: boolean
  onClose: () => void
  onDelete?: (itemId: string) => Promise<void>
  onUpdateNotes?: (itemId: string, notes: string, location: string) => Promise<void>
}

export default function CollectionItemDetailModal({
  item,
  isOpen,
  onClose,
  onDelete,
  onUpdateNotes
}: CollectionItemDetailModalProps) {
  const notifications = useNotifications()
  const [isEditing, setIsEditing] = useState(false)
  const [editedNotes, setEditedNotes] = useState('')
  const [editedLocation, setEditedLocation] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Reset editing state when item changes
  useEffect(() => {
    if (item) {
      setEditedNotes(item.notes || '')
      setEditedLocation(item.location || '')
      setIsEditing(false)
    }
  }, [item])

  if (!item) return null

  const handleSave = async () => {
    if (!onUpdateNotes) return

    setIsSaving(true)
    try {
      await onUpdateNotes(item.id, editedNotes, editedLocation)
      setIsEditing(false)
      notifications.success('Item updated successfully')
    } catch {
      notifications.error('Failed to update item')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return

    if (!window.confirm('Are you sure you want to remove this item from your collection?')) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete(item.id)
      onClose()
      notifications.success('Item removed from collection')
    } catch {
      notifications.error('Failed to remove item')
    } finally {
      setIsDeleting(false)
    }
  }

  const confidencePercentage = Math.round(item.confidence * 100)

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-card shadow-2xl transition-all">
                {/* Header with Image */}
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-64 md:h-80 object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  {/* Confidence Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={cn(
                      'px-3 py-1.5 rounded-full backdrop-blur-sm text-sm font-medium flex items-center gap-1.5',
                      confidencePercentage >= 80
                        ? 'bg-green-500/80 text-white'
                        : confidencePercentage >= 60
                          ? 'bg-yellow-500/80 text-white'
                          : 'bg-orange-500/80 text-white'
                    )}>
                      <ShieldCheck className="w-4 h-4" />
                      {confidencePercentage}% confidence
                    </div>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {item.name}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {item.era && (
                        <span className="px-2.5 py-1 bg-blue-500/80 text-white rounded-full text-sm font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.era}
                        </span>
                      )}
                      {item.style && (
                        <span className="px-2.5 py-1 bg-purple-500/80 text-white rounded-full text-sm font-medium flex items-center gap-1">
                          <Palette className="w-3.5 h-3.5" />
                          {item.style}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Value Section */}
                  {(item.estimated_value_min || item.estimated_value_max) && (
                    <GlassCard className="p-4" >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-success-muted rounded-lg">
                          <DollarSign className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Value</p>
                          <p className="text-xl font-bold text-success">
                            {item.estimated_value_min && item.estimated_value_max
                              ? `${formatCurrency(item.estimated_value_min)} - ${formatCurrency(item.estimated_value_max)}`
                              : formatCurrency(item.estimated_value_min || item.estimated_value_max || 0)
                            }
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  )}

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Notes & Location Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Your Notes
                      </h3>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Notes
                          </label>
                          <textarea
                            value={editedNotes}
                            onChange={(e) => setEditedNotes(e.target.value)}
                            placeholder="Add notes about this item..."
                            rows={3}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none bg-input text-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            value={editedLocation}
                            onChange={(e) => setEditedLocation(e.target.value)}
                            placeholder="Where is this item stored?"
                            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-input text-foreground"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setEditedNotes(item.notes || '')
                              setEditedLocation(item.location || '')
                              setIsEditing(false)
                            }}
                            className="flex-1 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {item.notes ? (
                          <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/50">
                            <p className="text-amber-800 italic">"{item.notes}"</p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">No notes added yet</p>
                        )}

                        {item.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Saved Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Added to collection {formatRelativeTime(item.saved_at)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button
                      onClick={onClose}
                      variant="outline"
                      size="default"
                      className="flex-1"
                    >
                      Close
                    </Button>

                    {onDelete && (
                      <Button
                        onClick={handleDelete}
                        variant="outline"
                        size="default"
                        className="!text-red-600 hover:!bg-red-50"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting ? 'Removing...' : 'Remove'}
                      </Button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
