import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Home, 
  DollarSign,
  Save,
  Check
} from 'lucide-react';
import PremiumHeader from '@/components/enhanced/PremiumHeader';
import { useVintageAnalysis } from '@/hooks/useVintageAnalysis';

const AVAILABLE_STYLES = [
  'Victorian', 'Art Deco', 'Mid-Century Modern', 'Art Nouveau', 'Bauhaus',
  'Colonial', 'Georgian', 'Regency', 'Empire', 'Rococo', 'Neoclassical',
  'Arts and Crafts', 'Mission', 'Shaker', 'Industrial', 'Rustic',
  'Scandinavian', 'French Country', 'English Country', 'Mediterranean'
];

const ROOM_TYPES = [
  'Living Room', 'Dining Room', 'Bedroom', 'Kitchen', 'Bathroom',
  'Home Office', 'Library/Study', 'Entryway', 'Basement', 'Attic',
  'Garage', 'Garden/Patio', 'Guest Room', 'Nursery', 'Walk-in Closet'
];

export default function PreferencesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getPreferences, savePreferences } = useVintageAnalysis();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [preferredStyles, setPreferredStyles] = useState<string[]>([]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [budgetRangeMin, setBudgetRangeMin] = useState<number | undefined>();
  const [budgetRangeMax, setBudgetRangeMax] = useState<number | undefined>();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    loadPreferences();
  }, [user, navigate]);

  const loadPreferences = async () => {
    setLoading(true);
    const prefs = await getPreferences();
    if (prefs) {
      setPreferredStyles(prefs.preferredStyles || []);
      setRoomTypes(prefs.roomTypes || []);
      setBudgetRangeMin(prefs.budgetRangeMin);
      setBudgetRangeMax(prefs.budgetRangeMax);
    }
    setLoading(false);
  };

  const handleStyleToggle = (style: string) => {
    setPreferredStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleRoomToggle = (room: string) => {
    setRoomTypes(prev => 
      prev.includes(room) 
        ? prev.filter(r => r !== room)
        : [...prev, room]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await savePreferences({
      preferredStyles,
      roomTypes,
      budgetRangeMin,
      budgetRangeMax
    });
    
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-8">
      <PremiumHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Preferences</h1>
              <p className="text-muted-foreground">Personalize your VintageVision experience</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-muted-foreground">Loading your preferences...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Style Preferences */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Style Preferences</h2>
                  <p className="text-sm text-muted-foreground">Select the vintage styles you love most</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {AVAILABLE_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => handleStyleToggle(style)}
                    className={`p-2 sm:p-3 min-h-12 text-left border rounded-lg transition-all ${
                      preferredStyles.includes(style)
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-border hover:border-muted-foreground text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium">{style}</span>
                      {preferredStyles.includes(style) && (
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary">
                  💡 <strong>Selected {preferredStyles.length} styles.</strong> We'll prioritize these styles in your recommendations and styling suggestions.
                </p>
              </div>
            </div>

            {/* Room Types */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Home className="w-6 h-6 text-blue-400" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Room Types</h2>
                  <p className="text-sm text-muted-foreground">Which rooms are you decorating or organizing?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {ROOM_TYPES.map((room) => (
                  <button
                    key={room}
                    onClick={() => handleRoomToggle(room)}
                    className={`p-2 sm:p-3 min-h-12 text-left border rounded-lg transition-all ${
                      roomTypes.includes(room)
                        ? 'border-info bg-info-muted text-info'
                        : 'border-border hover:border-muted-foreground text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium">{room}</span>
                      {roomTypes.includes(room) && (
                        <Check className="w-4 h-4 text-info flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-info-muted rounded-lg">
                <p className="text-sm text-info">
                  🏠 <strong>Selected {roomTypes.length} room types.</strong> We'll tailor styling suggestions to these spaces.
                </p>
              </div>
            </div>

            {/* Budget Range */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-success" />
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Budget Range</h2>
                  <p className="text-sm text-muted-foreground">Set your typical spending range for vintage items</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Minimum Budget ($)
                  </label>
                  <input
                    type="number"
                    value={budgetRangeMin || ''}
                    onChange={(e) => setBudgetRangeMin(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g., 50"
                    min="0"
                    className="w-full px-3 py-2 border border-border bg-card text-foreground rounded-lg focus:ring-2 focus:ring-success focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Maximum Budget ($)
                  </label>
                  <input
                    type="number"
                    value={budgetRangeMax || ''}
                    onChange={(e) => setBudgetRangeMax(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g., 500"
                    min="0"
                    className="w-full px-3 py-2 border border-border bg-card text-foreground rounded-lg focus:ring-2 focus:ring-success focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-success-muted rounded-lg">
                <p className="text-sm text-success">
                  💰 <strong>Budget helps us recommend items in your price range</strong> and highlight good deals that match your spending comfort zone.
                </p>
              </div>
            </div>

            {/* Save Actions */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Save Your Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    These preferences will personalize your VintageVision experience
                  </p>
                </div>
                
                <div className="flex gap-3">
                  {saved && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2 bg-success-muted text-success px-4 py-2 rounded-lg"
                    >
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Saved!</span>
                    </motion.div>
                  )}
                  
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>

              <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                <h4 className="font-medium text-primary mb-2">How This Helps You:</h4>
                <ul className="text-sm text-primary/80 space-y-1">
                  <li>• Get styling suggestions tailored to your favorite periods and rooms</li>
                  <li>• See marketplace recommendations within your budget</li>
                  <li>• Receive personalized notifications about items matching your style</li>
                  <li>• Enjoy a more relevant and useful VintageVision experience</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
