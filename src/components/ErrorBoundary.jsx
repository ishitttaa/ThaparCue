import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-base, #080b14)',
            color: 'var(--text-primary, #f1f5f9)',
            padding: '24px',
            fontFamily: 'var(--font-body, system-ui, sans-serif)',
          }}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: '480px',
              width: '100%',
              padding: '36px',
              textAlign: 'center',
              borderRadius: 'var(--radius-xl, 24px)',
              background: 'var(--bg-surface, #0f1422)',
              border: '1px solid var(--border, rgba(99, 102, 241, 0.2))',
              boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.6))',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</div>
            <h2
              className="font-display"
              style={{
                fontSize: 'var(--text-2xl, 1.5rem)',
                fontWeight: 700,
                marginBottom: '12px',
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                color: 'var(--text-secondary, #94a3b8)',
                fontSize: 'var(--text-sm, 0.875rem)',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              An unexpected error occurred. Don't worry, your data is safe and secure.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
                style={{ padding: '10px 20px' }}
              >
                ↻ Refresh Page
              </button>
              <button
                className="btn btn-primary"
                onClick={this.handleReset}
                style={{ padding: '10px 20px' }}
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

