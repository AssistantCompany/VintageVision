import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PremiumHome from "@/pages/PremiumHome";
import AuthCallbackPage from "@/pages/AuthCallback";
import PremiumCollectionPage from "@/components/enhanced/PremiumCollectionPage";
import PreferencesPage from "@/pages/Preferences";
import PremiumWishlistPage from "@/components/enhanced/PremiumWishlistPage";
import PremiumLandingPage from "@/pages/PremiumLandingPage";
import PremiumPricing from "@/pages/PremiumPricing";
import LegalPage from "@/pages/Legal";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import HelpPage from "@/pages/HelpPage";
import FeaturesPage from "@/pages/FeaturesPage";
import ProfilePage from "@/pages/ProfilePage";
import NotificationSystem from "@/components/enhanced/NotificationSystem";
import OfflineSupport from "@/components/enhanced/OfflineSupport";
import { SkipNavigation } from "@/components/enhanced/AccessibilityEnhancer";
import { NetworkStatus, PerformanceMonitor } from "@/components/enhanced/PerformanceOptimizer";
import SeoHead from "@/components/enhanced/SeoHead";
import { ErrorBoundary } from "@/components/enhanced/ErrorBoundary";
import ErrorReportSystem from "@/components/enhanced/ErrorReportSystem";
import MobileNavigation from "@/components/mobile/MobileNavigation";
import { SafeAreaProvider } from "@/components/mobile/SafeAreaProvider";

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
        <Router>
          <SeoHead />
          <SkipNavigation />
          <NotificationSystem />
          {/* Disabled annoying PWA prompts and accessibility menu */}
          {/* <PWAInstallBanner /> */}
          {/* <PWAEnhancements /> */}
          {/* <AdvancedPWAFeatures /> */}
          <OfflineSupport />
          {/* <AccessibilityMenu /> */}
          <NetworkStatus />
          <PerformanceMonitor />
          <ErrorReportSystem />
          <div id="main-content">
            <Routes>
          <Route path="/" element={<PremiumLandingPage />} />
          <Route path="/app" element={<PremiumHome />} />
          <Route path="/pricing" element={<PremiumPricing />} />
          <Route path="/legal/:type" element={<LegalPage />} />
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />
          <Route path="/cookies" element={<LegalPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/collection" element={<PremiumCollectionPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/wishlist" element={<PremiumWishlistPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        </div>
        <MobileNavigation />
      </Router>
    </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
