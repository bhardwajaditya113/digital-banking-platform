import React, { useState } from 'react';
import { Container, Card, Button, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaWallet, FaExchangeAlt, FaChartLine, FaMoneyBillWave, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/theme.css';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      title: 'Welcome to Digital Banking',
      description: 'Your secure financial platform',
      icon: FaCheckCircle,
      content: (
        <div className="text-center">
          <h4 className="mb-3">Get Started in 3 Easy Steps</h4>
          <p className="text-muted">
            We'll guide you through setting up your account and making your first transaction.
            This will only take a few minutes!
          </p>
        </div>
      )
    },
    {
      title: 'Create Your First Account',
      description: 'Start with a savings or checking account',
      icon: FaWallet,
      content: (
        <div>
          <h5 className="mb-3">Account Types</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <Card className="modern-card h-100">
                <Card.Body>
                  <h6 className="fw-bold">Savings Account</h6>
                  <p className="text-muted small mb-0">
                    Perfect for saving money with interest benefits
                  </p>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6">
              <Card className="modern-card h-100">
                <Card.Body>
                  <h6 className="fw-bold">Checking Account</h6>
                  <p className="text-muted small mb-0">
                    Ideal for daily transactions and payments
                  </p>
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="mt-4">
            <Button
              className="btn-modern btn-gradient"
              onClick={() => {
                navigate('/accounts');
                localStorage.setItem('onboarding_completed', 'true');
              }}
            >
              Create Account Now
            </Button>
          </div>
        </div>
      )
    },
    {
      title: 'Make Your First Transfer',
      description: 'Send money securely',
      icon: FaExchangeAlt,
      content: (
        <div>
          <h5 className="mb-3">How to Transfer Money</h5>
          <ol className="ps-3">
            <li className="mb-2">Go to the Transfer page</li>
            <li className="mb-2">Select your source account</li>
            <li className="mb-2">Enter recipient account details</li>
            <li className="mb-2">Enter amount and description</li>
            <li className="mb-2">Review and confirm</li>
          </ol>
          <div className="mt-4">
            <Button
              className="btn-modern btn-gradient"
              onClick={() => {
                navigate('/transfer');
                localStorage.setItem('onboarding_completed', 'true');
              }}
            >
              Try Transfer Now
            </Button>
          </div>
        </div>
      )
    },
    {
      title: 'Explore More Features',
      description: 'Investments, loans, and more',
      icon: FaChartLine,
      content: (
        <div>
          <h5 className="mb-3">Available Features</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <Card className="modern-card h-100">
                <Card.Body>
                  <FaChartLine size={24} className="mb-2 text-primary" />
                  <h6 className="fw-bold">Investments</h6>
                  <p className="text-muted small mb-0">
                    Manage your investment portfolios
                  </p>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-6">
              <Card className="modern-card h-100">
                <Card.Body>
                  <FaMoneyBillWave size={24} className="mb-2 text-success" />
                  <h6 className="fw-bold">Loans</h6>
                  <p className="text-muted small mb-0">
                    Apply for personal or business loans
                  </p>
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="mt-4">
            <Button
              className="btn-modern btn-gradient w-100"
              onClick={() => {
                localStorage.setItem('onboarding_completed', 'true');
                navigate('/dashboard');
              }}
            >
              Complete Setup
            </Button>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem('onboarding_completed', 'true');
      navigate('/dashboard');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/dashboard');
  };

  const Icon = steps[currentStep].icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <Container style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="modern-card glass" style={{ border: 'none', backdropFilter: 'blur(20px)' }}>
            <Card.Body style={{ padding: '3rem' }}>
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <Button
                    variant="link"
                    onClick={skipOnboarding}
                    className="text-muted small p-0"
                    style={{ textDecoration: 'none' }}
                  >
                    Skip
                  </Button>
                </div>
                <ProgressBar
                  now={progress}
                  style={{
                    height: '8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)'
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      background: 'var(--primary-gradient)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </ProgressBar>
              </div>

              {/* Step Icon */}
              <div className="text-center mb-4">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 1.5rem',
                    background: 'var(--primary-gradient)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: 'var(--shadow-xl)'
                  }}
                >
                  <Icon size={48} />
                </motion.div>
                <h2 className="gradient-text mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
                  {steps[currentStep].title}
                </h2>
                <p className="text-muted">{steps[currentStep].description}</p>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ minHeight: '300px' }}
                >
                  {steps[currentStep].content}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt-4 pt-4 border-top">
                <Button
                  variant="outline-secondary"
                  className="btn-modern"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <FaArrowLeft style={{ marginRight: '0.5rem' }} />
                  Previous
                </Button>
                <Button
                  className="btn-modern btn-gradient"
                  onClick={nextStep}
                >
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                  <FaArrowRight style={{ marginLeft: '0.5rem' }} />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default Onboarding;


