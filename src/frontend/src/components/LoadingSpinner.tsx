import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../styles/theme.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', fullScreen = false }) => {
  const sizeMap = {
    sm: '1rem',
    md: '2rem',
    lg: '3rem'
  };

  const spinner = (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: fullScreen ? '100vh' : '200px' }}>
      <div className="spinner-modern" style={{ width: sizeMap[size], height: sizeMap[size] }}></div>
    </div>
  );

  return spinner;
};

export default LoadingSpinner;


