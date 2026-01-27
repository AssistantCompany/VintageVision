import { StrictMode, Component, type ReactNode, type ErrorInfo } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { initSentry } from "@/lib/sentry";
import "@/index.css";
import App from "@/App.tsx";

// Initialize Sentry before rendering the app
initSentry();

// Error fallback component
function ErrorFallback({ error }: { error: Error | null }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We've been notified and are working to fix the issue.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
        >
          Reload Page
        </button>
        {import.meta.env.DEV && error && (
          <pre className="mt-6 p-4 bg-gray-800 rounded text-left text-sm overflow-auto">
            {error.toString()}
          </pre>
        )}
      </div>
    </div>
  );
}

// Custom Error Boundary that integrates with Sentry
// Using class component for error boundary (React requirement)
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class SentryErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Report to Sentry
    Sentry.withScope((scope) => {
      scope.setExtras({ componentStack: errorInfo.componentStack });
      Sentry.captureException(error);
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SentryErrorBoundary>
      <App />
    </SentryErrorBoundary>
  </StrictMode>
);
