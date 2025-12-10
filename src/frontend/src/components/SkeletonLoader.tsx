import React from 'react';
import { Card } from 'react-bootstrap';
import '../styles/theme.css';

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'text' | 'circle';
  count?: number;
  height?: string;
  width?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'card', 
  count = 1, 
  height,
  width 
}) => {
  const skeletonStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton-loading 1.5s ease-in-out infinite',
    borderRadius: 'var(--radius-md)',
    height: height || (type === 'circle' ? '48px' : type === 'text' ? '1rem' : '200px'),
    width: width || (type === 'circle' ? '48px' : '100%'),
    marginBottom: type === 'text' ? '0.5rem' : '1rem'
  };

  if (type === 'card') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="modern-card mb-3" style={{ border: 'none' }}>
            <Card.Body>
              <div style={skeletonStyle} />
              <div style={{ ...skeletonStyle, height: '1rem', width: '60%' }} />
              <div style={{ ...skeletonStyle, height: '1rem', width: '40%' }} />
            </Card.Body>
          </Card>
        ))}
        <style>{`
          @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </>
    );
  }

  if (type === 'table') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <tr key={i}>
            <td><div style={{ ...skeletonStyle, height: '1rem' }} /></td>
            <td><div style={{ ...skeletonStyle, height: '1rem' }} /></td>
            <td><div style={{ ...skeletonStyle, height: '1rem' }} /></td>
            <td><div style={{ ...skeletonStyle, height: '1rem' }} /></td>
          </tr>
        ))}
        <style>{`
          @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={skeletonStyle} />
      ))}
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
};

export default SkeletonLoader;


