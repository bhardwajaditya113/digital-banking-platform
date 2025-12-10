import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { fetchAccounts } from '../store/slices/accountSlice';
import { transfer } from '../store/slices/transactionSlice';
import { FaExchangeAlt, FaArrowRight, FaCalculator, FaInfoCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/theme.css';

const ModernTransfer: React.FC = () => {
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    currency: 'USD',
    description: '',
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { accounts } = useSelector((state: RootState) => state.account);
  const { loading, error } = useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAccounts(user.id));
    }
  }, [dispatch, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(transfer({
        fromAccountId: formData.fromAccountId,
        toAccountId: formData.toAccountId,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        description: formData.description,
      }));
      if (transfer.fulfilled.match(result)) {
        toast.success('Transfer initiated successfully! 🎉');
        navigate('/transactions');
      } else {
        toast.error(error || 'Transfer failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectedAccount = accounts.find(a => a.id === formData.fromAccountId);
  const transactionFee = formData.amount ? Math.max(parseFloat(formData.amount) * 0.01, 0.50) : 0;
  const totalAmount = formData.amount ? parseFloat(formData.amount) + transactionFee : 0;

  return (
    <Container fluid className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-4">
          <h1 className="gradient-text mb-2" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            Transfer Money
          </h1>
          <p className="text-muted">Send money securely between accounts</p>
        </div>

        <Row>
          <Col lg={8}>
            <Card className="modern-card">
              <Card.Body style={{ padding: '2rem' }}>
                {error && (
                  <Alert variant="danger" className="modern-card mb-4">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold mb-2 d-flex align-items-center">
                      <FaExchangeAlt style={{ marginRight: '0.5rem' }} />
                      From Account
                    </Form.Label>
                    <Form.Select
                      name="fromAccountId"
                      value={formData.fromAccountId}
                      onChange={handleChange}
                      className="modern-input"
                      required
                      style={{ padding: '0.875rem 1rem' }}
                    >
                      <option value="">Select account</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.accountNumber} - {account.accountType} (${account.balance.toFixed(2)} {account.currency})
                        </option>
                      ))}
                    </Form.Select>
                    {selectedAccount && (
                      <Form.Text className="text-muted mt-1 d-block">
                        Available: ${selectedAccount.availableBalance.toFixed(2)}
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold mb-2">To Account ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="toAccountId"
                      value={formData.toAccountId}
                      onChange={handleChange}
                      placeholder="Enter recipient account ID"
                      className="modern-input"
                      required
                      style={{ padding: '0.875rem 1rem' }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-2">Amount</Form.Label>
                        <Form.Control
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          className="modern-input"
                          required
                          style={{ padding: '0.875rem 1rem' }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold mb-2">Currency</Form.Label>
                        <Form.Select
                          name="currency"
                          value={formData.currency}
                          onChange={handleChange}
                          className="modern-input"
                          style={{ padding: '0.875rem 1rem' }}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="AED">AED</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold mb-2">Description (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Add a note for this transfer"
                      className="modern-input"
                      style={{ padding: '0.875rem 1rem' }}
                    />
                  </Form.Group>

                  <motion.div
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
                          Processing...
                        </span>
                      ) : (
                        <>
                          <FaExchangeAlt style={{ marginRight: '0.5rem' }} />
                          Transfer Money
                        </>
                      )}
                    </Button>
                  </motion.div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="modern-card" style={{ position: 'sticky', top: '2rem' }}>
                <Card.Body style={{ padding: '2rem' }}>
                  <div className="d-flex align-items-center mb-3">
                    <div
                      style={{
                        background: 'var(--primary-gradient)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '0.75rem',
                        color: 'white',
                        marginRight: '1rem'
                      }}
                    >
                      <FaCalculator size={24} />
                    </div>
                    <h5 className="mb-0 fw-bold">Transfer Summary</h5>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Transfer Amount</span>
                      <span className="fw-semibold">
                        {formData.amount ? `$${parseFloat(formData.amount).toFixed(2)}` : '$0.00'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">
                        <FaInfoCircle size={12} style={{ marginRight: '0.25rem' }} />
                        Transaction Fee (1%)
                      </span>
                      <span className="fw-semibold text-warning">
                        ${transactionFee.toFixed(2)}
                      </span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold">Total Amount</span>
                      <span className="fw-bold" style={{ fontSize: '1.25rem', color: 'var(--primary-color)' }}>
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1rem',
                      marginTop: '1.5rem'
                    }}
                  >
                    <small className="text-muted d-block mb-2">
                      <FaInfoCircle style={{ marginRight: '0.25rem' }} />
                      Important Notes:
                    </small>
                    <ul className="mb-0 small text-muted" style={{ paddingLeft: '1.25rem' }}>
                      <li>Minimum transaction fee: $0.50</li>
                      <li>Transfers are processed instantly</li>
                      <li>Please verify account details</li>
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default ModernTransfer;

