import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { FaHome, FaWallet, FaExchangeAlt, FaChartLine, FaMoneyBillWave, FaSignOutAlt, FaUserCircle, FaCog, FaQuestionCircle, FaFile } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import '../styles/theme.css';

const ModernNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/accounts', label: 'Accounts', icon: FaWallet },
    { path: '/transactions', label: 'Transactions', icon: FaExchangeAlt },
    { path: '/transfer', label: 'Transfer', icon: FaExchangeAlt },
    { path: '/investments', label: 'Investments', icon: FaChartLine },
    { path: '/loans', label: 'Loans', icon: FaMoneyBillWave },
    { path: '/statements', label: 'Statements', icon: FaFile },
  ];

  return (
    <BootstrapNavbar 
      bg="white" 
      expand="lg" 
      className="modern-navbar shadow-sm"
      style={{ 
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 0'
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BootstrapNavbar.Brand 
            href="/dashboard"
            className="gradient-text"
            style={{ fontSize: '1.5rem', fontWeight: 700 }}
          >
            💳 Digital Banking
          </BootstrapNavbar.Brand>
        </motion.div>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" style={{ gap: '0.5rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Nav.Link
                    href={item.path}
                    className={`d-flex align-items-center ${isActive ? 'text-primary fw-bold' : ''}`}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      transition: 'all var(--transition-base)',
                      backgroundColor: isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent'
                    }}
                  >
                    <Icon style={{ marginRight: '0.5rem' }} />
                    {item.label}
                  </Nav.Link>
                </motion.div>
              );
            })}
          </Nav>
          
          <Nav className="d-flex align-items-center">
            <ThemeToggle />
            <Dropdown align="end" className="ms-3">
              <Dropdown.Toggle
                variant="link"
                className="d-flex align-items-center text-decoration-none"
                style={{ color: 'var(--text-primary)' }}
              >
                <FaUserCircle size={24} style={{ marginRight: '0.5rem' }} />
                <span className="d-none d-md-inline">
                  {user?.firstName} {user?.lastName}
                </span>
              </Dropdown.Toggle>
              
              <Dropdown.Menu className="shadow-lg" style={{ borderRadius: 'var(--radius-lg)', border: 'none' }}>
                <Dropdown.Item disabled>
                  <small className="text-muted">{user?.email}</small>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="/settings">
                  <FaCog style={{ marginRight: '0.5rem' }} />
                  Settings
                </Dropdown.Item>
                <Dropdown.Item href="/help">
                  <FaQuestionCircle style={{ marginRight: '0.5rem' }} />
                  Help & Support
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default ModernNavbar;

