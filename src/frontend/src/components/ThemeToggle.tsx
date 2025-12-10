import React from 'react';
import { Button } from 'react-bootstrap';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        variant="link"
        onClick={toggleTheme}
        className="p-2"
        style={{
          color: 'var(--text-primary)',
          textDecoration: 'none',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-tertiary)',
          border: 'none',
          minWidth: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? (
          <FaMoon size={18} />
        ) : (
          <FaSun size={18} />
        )}
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;


