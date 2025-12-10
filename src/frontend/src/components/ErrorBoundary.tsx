import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="modern-card" style={{ maxWidth: '500px', textAlign: 'center', padding: '2rem' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 1.5rem',
                  background: 'var(--secondary-gradient)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <FaExclamationTriangle size={40} />
              </div>
              <h3 className="mb-3 fw-bold">Oops! Something went wrong</h3>
              <p className="text-muted mb-4">
                We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
              </p>
              {this.state.error && (
                <details className="mb-4 text-start">
                  <summary className="text-muted small mb-2" style={{ cursor: 'pointer' }}>
                    Error Details
                  </summary>
                  <pre
                    style={{
                      background: 'var(--bg-tertiary)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      maxHeight: '200px'
                    }}
                  >
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <div className="d-flex gap-2 justify-content-center">
                <Button
                  className="btn-modern btn-gradient"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
                <Button
                  variant="outline-secondary"
                  className="btn-modern"
                  onClick={() => this.setState({ hasError: false, error: null })}
                >
                  Try Again
                </Button>
              </div>
            </Card>
          </motion.div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


