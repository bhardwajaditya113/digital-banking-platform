import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { fetchAccounts, createAccount } from '../store/slices/accountSlice';
import { FaWallet, FaPlus, FaSearch, FaEye, FaCopy, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/theme.css';

const ModernAccounts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { accounts, loading } = useSelector((state: RootState) => state.account);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [accountType, setAccountType] = useState('Savings');
  const [currency, setCurrency] = useState('USD');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAccounts(user.id));
    }
  }, [dispatch, user]);

  const handleCreateAccount = async () => {
    if (user?.id) {
      try {
        await dispatch(createAccount({ accountType, currency }));
        dispatch(fetchAccounts(user.id));
        setShowCreateModal(false);
        toast.success('Account created successfully! 🎉');
      } catch (error) {
        toast.error('Failed to create account');
      }
    }
  };

  const handleCopyAccountNumber = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedId(accountNumber);
    toast.success('Account number copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAccounts = accounts.filter(account =>
    account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalAvailable = accounts.reduce((sum, acc) => sum + acc.availableBalance, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Container fluid className="py-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 className="gradient-text mb-2" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              My Accounts
            </h1>
            <p className="text-muted">Manage your banking accounts</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="btn-modern btn-gradient"
              onClick={() => setShowCreateModal(true)}
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <FaPlus style={{ marginRight: '0.5rem' }} />
              Create New Account
            </Button>
          </motion.div>
        </motion.div>

        {/* Summary Cards */}
        <Row className="g-4 mb-4">
          <Col xs={12} md={6} lg={3}>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="stat-card success h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Total Balance</h6>
                      <h3 className="mb-0 fw-bold">${totalBalance.toFixed(2)}</h3>
                    </div>
                    <FaWallet size={32} color="var(--success-color)" />
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="stat-card info h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Available</h6>
                      <h3 className="mb-0 fw-bold">${totalAvailable.toFixed(2)}</h3>
                    </div>
                    <FaCheckCircle size={32} color="var(--info-color)" />
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="stat-card h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Total Accounts</h6>
                      <h3 className="mb-0 fw-bold">{accounts.length}</h3>
                    </div>
                    <FaWallet size={32} color="var(--primary-color)" />
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <motion.div variants={itemVariants} whileHover={{ scale: 1.05, y: -5 }}>
              <Card className="stat-card warning h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">Active Accounts</h6>
                      <h3 className="mb-0 fw-bold">{accounts.filter(a => a.isActive).length}</h3>
                    </div>
                    <FaCheckCircle size={32} color="var(--warning-color)" />
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="mb-4">
          <InputGroup className="modern-card" style={{ padding: '0.5rem', border: 'none' }}>
            <InputGroup.Text style={{ background: 'transparent', border: 'none' }}>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search accounts by number or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-input"
              style={{ border: 'none', boxShadow: 'none' }}
            />
          </InputGroup>
        </motion.div>

        {/* Accounts Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredAccounts.length === 0 ? (
          <motion.div variants={itemVariants}>
            <Card className="modern-card text-center" style={{ padding: '4rem 2rem' }}>
              <FaWallet size={64} className="text-muted mb-3 opacity-50" />
              <h4 className="mb-2">No accounts found</h4>
              <p className="text-muted mb-4">
                {searchTerm ? 'Try a different search term' : 'Create your first account to get started'}
              </p>
              {!searchTerm && (
                <Button className="btn-modern btn-gradient" onClick={() => setShowCreateModal(true)}>
                  <FaPlus style={{ marginRight: '0.5rem' }} />
                  Create Account
                </Button>
              )}
            </Card>
          </motion.div>
        ) : (
          <Row className="g-4">
            {filteredAccounts.map((account, index) => (
              <Col xs={12} md={6} lg={4} key={account.id}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="modern-card h-100">
                    <Card.Body style={{ padding: '1.5rem' }}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="text-muted mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {account.accountType}
                          </h6>
                          <h5 className="mb-0 fw-bold">{account.currency}</h5>
                        </div>
                        <div
                          style={{
                            background: 'var(--primary-gradient)',
                            borderRadius: 'var(--radius-full)',
                            padding: '0.5rem',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '48px',
                            height: '48px'
                          }}
                        >
                          <FaWallet size={20} />
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted small">Account Number</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0"
                            onClick={() => handleCopyAccountNumber(account.accountNumber)}
                            style={{ minWidth: 'auto', padding: '0' }}
                          >
                            {copiedId === account.accountNumber ? (
                              <FaCheckCircle color="var(--success-color)" size={16} />
                            ) : (
                              <FaCopy color="var(--text-muted)" size={16} />
                            )}
                          </Button>
                        </div>
                        <h6 className="fw-bold" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                          {account.accountNumber}
                        </h6>
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="text-muted small">Balance</span>
                          <span className="fw-bold" style={{ fontSize: '1.25rem', color: 'var(--success-color)' }}>
                            ${account.balance.toFixed(2)}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted small">Available</span>
                          <span className="fw-semibold">${account.availableBalance.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          className="btn-modern flex-fill"
                          onClick={() => navigate(`/transactions?accountId=${account.id}`)}
                        >
                          <FaEye style={{ marginRight: '0.5rem' }} />
                          View
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}

        {/* Create Account Modal */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
          <Modal.Header closeButton style={{ borderBottom: '1px solid var(--border-color)' }}>
            <Modal.Title className="fw-bold">Create New Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Account Type</Form.Label>
                <Form.Select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="modern-input"
                >
                  <option value="Savings">Savings</option>
                  <option value="Checking">Checking</option>
                  <option value="Investment">Investment</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Currency</Form.Label>
                <Form.Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="modern-input"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="AED">AED - UAE Dirham</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: '1px solid var(--border-color)' }}>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button className="btn-modern btn-gradient" onClick={handleCreateAccount} disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Container>
  );
};

export default ModernAccounts;


