import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store/store';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import '../styles/theme.css';

const ModernLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } else {
      toast.error(error || 'Login failed');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          top: '-250px',
          right: '-250px',
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          bottom: '-150px',
          left: '-150px',
          animation: 'float 15s ease-in-out infinite reverse'
        }}
      />

      <Container style={{ maxWidth: '450px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="modern-card glass" style={{ border: 'none', backdropFilter: 'blur(20px)' }}>
            <Card.Body style={{ padding: '3rem' }}>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-4"
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 1.5rem',
                    background: 'var(--primary-gradient)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-xl)'
                  }}
                >
                  <FaSignInAlt size={40} color="white" />
                </div>
                <h2 className="gradient-text mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
                  Welcome Back
                </h2>
                <p className="text-muted">Sign in to your account to continue</p>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Alert variant="danger" className="modern-card" style={{ borderRadius: 'var(--radius-lg)' }}>
                    {error}
                  </Alert>
                </motion.div>
              )}

              <Form onSubmit={handleSubmit}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold mb-2">
                      <FaEnvelope style={{ marginRight: '0.5rem' }} />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="modern-input"
                      style={{ padding: '0.875rem 1rem' }}
                    />
                  </Form.Group>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold mb-2">
                      <FaLock style={{ marginRight: '0.5rem' }} />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="modern-input"
                      style={{ padding: '0.875rem 1rem' }}
                    />
                  </Form.Group>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="btn-modern btn-gradient w-100"
                    disabled={loading}
                    style={{
                      padding: '0.875rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginTop: '1rem'
                    }}
                  >
                    {loading ? (
                      <span className="d-flex align-items-center justify-content-center">
                        <div className="spinner-modern" style={{ width: '20px', height: '20px', marginRight: '0.5rem' }}></div>
                        Signing in...
                      </span>
                    ) : (
                      <>
                        <FaSignInAlt style={{ marginRight: '0.5rem' }} />
                        Sign In
                      </>
                    )}
                  </Button>
                </motion.div>
              </Form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-4"
              >
                <p className="text-muted mb-0">
                  Don't have an account?{' '}
                  <a
                    href="/register"
                    style={{
                      color: 'var(--primary-color)',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    Sign up here
                  </a>
                </p>
              </motion.div>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, -30px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default ModernLogin;


