import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store/store';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import '../styles/theme.css';

const ModernRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      toast.success('Account created successfully! 🎉');
      navigate('/dashboard');
    } else {
      toast.error(error || 'Registration failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      <Container style={{ maxWidth: '550px', position: 'relative', zIndex: 1 }}>
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
                  <FaUserPlus size={40} color="white" />
                </div>
                <h2 className="gradient-text mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
                  Create Account
                </h2>
                <p className="text-muted">Join us and start your financial journey</p>
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
                <div className="row">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="col-md-6 mb-3"
                  >
                    <Form.Group>
                      <Form.Label className="fw-semibold mb-2">
                        <FaUser style={{ marginRight: '0.5rem' }} />
                        First Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="modern-input"
                        style={{ padding: '0.875rem 1rem' }}
                      />
                    </Form.Group>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="col-md-6 mb-3"
                  >
                    <Form.Group>
                      <Form.Label className="fw-semibold mb-2">
                        <FaUser style={{ marginRight: '0.5rem' }} />
                        Last Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="modern-input"
                        style={{ padding: '0.875rem 1rem' }}
                      />
                    </Form.Group>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold mb-2">
                      <FaEnvelope style={{ marginRight: '0.5rem' }} />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="modern-input"
                      style={{ padding: '0.875rem 1rem' }}
                    />
                  </Form.Group>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold mb-2">
                      <FaPhone style={{ marginRight: '0.5rem' }} />
                      Phone Number
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
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
                >
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold mb-2">
                      <FaLock style={{ marginRight: '0.5rem' }} />
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="modern-input"
                      style={{ padding: '0.875rem 1rem' }}
                    />
                  </Form.Group>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
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
                        Creating account...
                      </span>
                    ) : (
                      <>
                        <FaUserPlus style={{ marginRight: '0.5rem' }} />
                        Create Account
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
                  Already have an account?{' '}
                  <a
                    href="/login"
                    style={{
                      color: 'var(--primary-color)',
                      textDecoration: 'none',
                      fontWeight: 600
                    }}
                  >
                    Sign in here
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

export default ModernRegister;


