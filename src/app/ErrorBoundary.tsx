import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  /** Rendered instead of the children once any of them throws. */
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  failed: boolean;
}

/**
 * Contains a failure to the subtree it wraps. Around the galaxy it means a WebGL or shader error
 * (or a failed chunk download) removes only the 3D layer; the HTML site underneath is untouched.
 * A class component because React still offers error boundaries only through class lifecycles.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
