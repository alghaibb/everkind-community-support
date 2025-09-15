"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Provides user-friendly error UI with recovery options
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            reset={() => this.setState({ hasError: false, error: undefined })}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error!}
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component with professional styling
 */
function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-destructive/20">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-destructive/10 rounded-full animate-pulse"></div>
            <AlertTriangle className="w-8 h-8 text-destructive absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <CardTitle className="text-destructive">
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            We encountered an unexpected error. Please try again or return to
            the homepage.
          </p>

          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-muted p-3 rounded text-xs">
              <summary className="cursor-pointer font-medium">
                Error Details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button onClick={reset} className="flex-1" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button asChild variant="outline" className="flex-1" size="sm">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * HOC to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
}
