import React from 'react';
import { ErrorState } from './ui/ErrorState';
import { Home } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Optionally navigate to home page
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title="Oops! Something went wrong"
          message={
            this.props.fallbackMessage ||
            'We encountered an unexpected error. Please try again.'
          }
          actionLabel="Return Home"
          actionIcon={<Home />}
          onAction={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 