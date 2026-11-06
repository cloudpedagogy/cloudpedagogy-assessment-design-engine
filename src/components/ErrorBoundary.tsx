import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="max-width-container" style={{ padding: '2rem 1rem' }}>
          <div 
            className="cp-card" 
            style={{ 
              borderLeft: '4px solid var(--color-danger)',
              backgroundColor: '#FEF2F2',
              borderColor: '#FCA5A5'
            }}
          >
            <div className="flex items-center gap-md mb-md">
              <AlertTriangle size={28} style={{ color: 'var(--color-danger)' }} />
              <div>
                <h2 className="mb-0" style={{ color: '#991B1B' }}>Application Error</h2>
                <p className="mb-0 text-small text-muted">
                  An unexpected error occurred while displaying the application.
                </p>
              </div>
            </div>

            <p style={{ color: '#7F1D1D', marginBottom: '1rem' }}>
              Your existing assessment data in local storage has <strong>not</strong> been deleted or overwritten.
            </p>

            {this.state.error?.message && (
              <pre 
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  padding: '12px', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                  border: '1px solid #FECACA',
                  color: '#991B1B',
                  marginBottom: '1.5rem'
                }}
              >
                {this.state.error.message}
              </pre>
            )}

            <div className="flex items-center gap-md">
              <button 
                type="button"
                className="cp-button-primary" 
                onClick={this.handleReload}
              >
                <RefreshCw size={16} /> Reload Application
              </button>
              <button 
                type="button"
                className="cp-button-secondary" 
                onClick={this.handleResetError}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
