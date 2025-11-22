import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@getmocha/users-service/react";
import PremiumHome from "@/react-app/pages/PremiumHome";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import PremiumCollectionPage from "@/react-app/components/enhanced/PremiumCollectionPage";
import PreferencesPage from "@/react-app/pages/Preferences";
import PremiumWishlistPage from "@/react-app/components/enhanced/PremiumWishlistPage";
import PremiumLandingPage from "@/react-app/pages/PremiumLandingPage";
import PremiumPricing from "@/react-app/pages/PremiumPricing";
import LegalPage from "@/react-app/pages/Legal";
import AboutPage from "@/react-app/pages/AboutPage";
import ContactPage from "@/react-app/pages/ContactPage";
import HelpPage from "@/react-app/pages/HelpPage";
import FeaturesPage from "@/react-app/pages/FeaturesPage";
import ProfilePage from "@/react-app/pages/ProfilePage";
import NotificationSystem from "@/react-app/components/enhanced/NotificationSystem";
import PWAInstallBanner from "@/react-app/components/enhanced/PWAInstallBanner";
import PWAEnhancements from "@/react-app/components/enhanced/PWAEnhancements";
import AdvancedPWAFeatures from "@/react-app/components/enhanced/AdvancedPWAFeatures";
import OfflineSupport from "@/react-app/components/enhanced/OfflineSupport";
import { AccessibilityMenu, SkipNavigation } from "@/react-app/components/enhanced/AccessibilityEnhancer";
import { NetworkStatus, PerformanceMonitor } from "@/react-app/components/enhanced/PerformanceOptimizer";
import SeoHead from "@/react-app/components/enhanced/SeoHead";
import { ErrorBoundary } from "@/react-app/components/enhanced/ErrorBoundary";
import ErrorReportSystem from "@/react-app/components/enhanced/ErrorReportSystem";
import MobileNavigation from "@/react-app/components/mobile/MobileNavigation";
import { SafeAreaProvider } from "@/react-app/components/mobile/SafeAreaProvider";

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
        <Router>
          <SeoHead />
          <SkipNavigation />
          <NotificationSystem />
          <PWAInstallBanner />
          <PWAEnhancements />
          <AdvancedPWAFeatures />
          <OfflineSupport />
          <AccessibilityMenu />
          <NetworkStatus />
          <PerformanceMonitor />
          <ErrorReportSystem />
          <div id="main-content">
            <Routes>
          <Route path="/" element={<PremiumHome />} />
          <Route path="/landing" element={<PremiumLandingPage />} />
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
