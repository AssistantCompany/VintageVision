import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Lazy-loaded page components for code splitting
const PremiumHome = lazy(() => import("@/pages/PremiumHome"));
const PremiumCollectionPage = lazy(() => import("@/components/enhanced/PremiumCollectionPage"));
const PreferencesPage = lazy(() => import("@/pages/Preferences"));
const PremiumWishlistPage = lazy(() => import("@/components/enhanced/PremiumWishlistPage"));
const PremiumLandingPage = lazy(() => import("@/pages/PremiumLandingPage"));
const PremiumPricing = lazy(() => import("@/pages/PremiumPricing"));
const PremiumFeatures = lazy(() => import("@/pages/PremiumFeatures"));
const LegalPage = lazy(() => import("@/pages/Legal"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const HelpPage = lazy(() => import("@/pages/HelpPage"));
const FeaturesPage = lazy(() => import("@/pages/FeaturesPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));

// Keep auth callback as eager import (needed immediately for OAuth flow)
import AuthCallbackPage from "@/pages/AuthCallback";

// Core components that should load eagerly
import NotificationSystem from "@/components/enhanced/NotificationSystem";
import OfflineSupport from "@/components/enhanced/OfflineSupport";
import { SkipNavigation } from "@/components/enhanced/AccessibilityEnhancer";
import { NetworkStatus, PerformanceMonitor } from "@/components/enhanced/PerformanceOptimizer";
import SeoHead from "@/components/enhanced/SeoHead";
import { ErrorBoundary } from "@/components/enhanced/ErrorBoundary";
import ErrorReportSystem from "@/components/enhanced/ErrorReportSystem";
import MobileNavigation from "@/components/mobile/MobileNavigation";
import { SafeAreaProvider } from "@/components/mobile/SafeAreaProvider";
import OnboardingWrapper from "@/components/enhanced/OnboardingWrapper";

// Page loading spinner component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-50">
    <div className="animate-spin w-8 h-8 border-4 border-brass-500 border-t-transparent rounded-full" />
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
        <Router>
          <SeoHead />
          <SkipNavigation />
          <NotificationSystem />
          <OnboardingWrapper />
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
          <Route path="/" element={
            <Suspense fallback={<PageLoader />}>
              <PremiumLandingPage />
            </Suspense>
          } />
          <Route path="/app" element={
            <Suspense fallback={<PageLoader />}>
              <PremiumHome />
            </Suspense>
          } />
          <Route path="/pricing" element={
            <Suspense fallback={<PageLoader />}>
              <PremiumPricing />
            </Suspense>
          } />
          <Route path="/premium" element={
            <Suspense fallback={<PageLoader />}>
              <PremiumFeatures />
            </Suspense>
          } />
          <Route path="/legal/:type" element={
            <Suspense fallback={<PageLoader />}>
              <LegalPage />
            </Suspense>
          } />
          <Route path="/privacy" element={
            <Suspense fallback={<PageLoader />}>
              <LegalPage />
            </Suspense>
          } />
          <Route path="/terms" element={
            <Suspense fallback={<PageLoader />}>
              <LegalPage />
            </Suspense>
          } />
          <Route path="/cookies" element={
            <Suspense fallback={<PageLoader />}>
              <LegalPage />
            </Suspense>
          } />
          <Route path="/about" element={
            <Suspense fallback={<PageLoader />}>
              <AboutPage />
            </Suspense>
          } />
          <Route path="/contact" element={
            <Suspense fallback={<PageLoader />}>
              <ContactPage />
            </Suspense>
          } />
          <Route path="/help" element={
            <Suspense fallback={<PageLoader />}>
              <HelpPage />
            </Suspense>
          } />
          <Route path="/features" element={
            <Suspense fallback={<PageLoader />}>
              <FeaturesPage />
            </Suspense>
          } />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/collection" element={
            <Suspense fallback={<PageLoader />}>
              <PremiumCollectionPage />
            </Suspense>
          } />
          <Route path="/preferences" element={
            <Suspense fallback={<PageLoader />}>
              <PreferencesPage />
            </Suspense>
          } />
          <Route path="/wishlist" element={
            <Suspense fallback={<PageLoader />}>
              <PremiumWishlistPage />
            </Suspense>
          } />
          <Route path="/profile" element={
            <Suspense fallback={<PageLoader />}>
              <ProfilePage />
            </Suspense>
          } />
        </Routes>
        </div>
        <MobileNavigation />
      </Router>
    </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
