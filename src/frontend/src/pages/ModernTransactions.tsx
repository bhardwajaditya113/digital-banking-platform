import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, InputGroup, Form, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { fetchTransactions } from '../store/slices/transactionSlice';
import { FaExchangeAlt, FaSearch, FaFilter, FaDownload, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import ExportButton from '../components/ExportButton';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/theme.css';

const ModernTransactions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId');
  const { transactions, loading } = useSelector((state: RootState) => state.transaction);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    if (accountId) {
      dispatch(fetchTransactions(accountId));
    }
  }, [dispatch, accountId]);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesType = typeFilter === 'all' || t.transactionType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: { bg: string; text: string } } = {
      Completed: { bg: 'success', text: 'white' },
      Pending: { bg: 'warning', text: 'dark' },
      Failed: { bg: 'danger', text: 'white' },
      Processing: { bg: 'info', text: 'white' }
    };
    const variant = variants[status] || { bg: 'secondary', text: 'white' };
    return <Badge bg={variant.bg} className="badge-modern">{status}</Badge>;
  };

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalFees = filteredTransactions.reduce((sum, t) => sum + (t.fee || 0), 0);

  return (
    <Container fluid className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 className="gradient-text mb-2" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              Transactions
            </h1>
            <p className="text-muted">View and manage your transaction history</p>
          </div>
          {filteredTransactions.length > 0 && (
            <ExportButton
              data={filteredTransactions.map(t => ({
                Reference: t.referenceNumber || 'N/A',
                Type: t.transactionType,
                Amount: `$${t.amount.toFixed(2)}`,
                Currency: t.currency,
                Fee: `$${(t.fee || 0).toFixed(2)}`,
                Status: t.status,
                Date: new Date(t.createdAt).toLocaleString(),
                Description: t.description || 'N/A'
              }))}
              filename="transactions"
              type="csv"
            />
          )}
        </div>

        {!accountId ? (
          <Card className="modern-card text-center" style={{ padding: '4rem 2rem' }}>
            <FaExchangeAlt size={64} className="text-muted mb-3 opacity-50" />
            <h4 className="mb-2">No Account Selected</h4>
            <p className="text-muted">Please select an account to view transactions.</p>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <Row className="g-4 mb-4">
              <Col xs={12} md={4}>
                <Card className="stat-card success h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Total Amount</h6>
                        <h3 className="mb-0 fw-bold">${totalAmount.toFixed(2)}</h3>
                      </div>
                      <FaArrowUp size={32} color="var(--success-color)" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={4}>
                <Card className="stat-card warning h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Total Fees</h6>
                        <h3 className="mb-0 fw-bold">${totalFees.toFixed(2)}</h3>
                      </div>
                      <FaArrowDown size={32} color="var(--warning-color)" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={4}>
                <Card className="stat-card info h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-2">Total Transactions</h6>
                        <h3 className="mb-0 fw-bold">{filteredTransactions.length}</h3>
                      </div>
                      <FaExchangeAlt size={32} color="var(--info-color)" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Filters */}
            <Card className="modern-card mb-4">
              <Card.Body>
                <Row className="g-3">
                  <Col xs={12} md={4}>
                    <InputGroup>
                      <InputGroup.Text style={{ background: 'transparent', border: 'none' }}>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="modern-input"
                        style={{ border: 'none', boxShadow: 'none' }}
                      />
                    </InputGroup>
                  </Col>
                  <Col xs={12} md={4}>
                    <InputGroup>
                      <InputGroup.Text style={{ background: 'transparent', border: 'none' }}>
                        <FaFilter />
                      </InputGroup.Text>
                      <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="modern-input"
                        style={{ border: 'none', boxShadow: 'none' }}
                      >
                        <option value="all">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                        <option value="Processing">Processing</option>
                      </Form.Select>
                    </InputGroup>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="modern-input"
                    >
                      <option value="all">All Types</option>
                      <option value="Transfer">Transfer</option>
                      <option value="Deposit">Deposit</option>
                      <option value="Withdrawal">Withdrawal</option>
                      <option value="Payment">Payment</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Transactions Table */}
            {loading ? (
              <LoadingSpinner />
            ) : filteredTransactions.length === 0 ? (
              <Card className="modern-card text-center" style={{ padding: '4rem 2rem' }}>
                <FaExchangeAlt size={64} className="text-muted mb-3 opacity-50" />
                <h4 className="mb-2">No transactions found</h4>
                <p className="text-muted">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'No transactions for this account yet'}
                </p>
              </Card>
            ) : (
              <Card className="modern-card">
                <Card.Body style={{ padding: 0 }}>
                  <div style={{ overflowX: 'auto' }}>
                    <Table hover className="mb-0">
                      <thead style={{ background: 'var(--bg-tertiary)' }}>
                        <tr>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Reference</th>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Type</th>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Amount</th>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Fee</th>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
                          <th style={{ padding: '1rem', fontWeight: 600 }}>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((transaction) => (
                          <motion.tr
                            key={transaction.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ background: 'var(--bg-tertiary)' }}
                            style={{ transition: 'background 0.2s' }}
                          >
                            <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                              {transaction.referenceNumber || 'N/A'}
                            </td>
                            <td style={{ padding: '1rem' }}>{transaction.transactionType}</td>
                            <td style={{ padding: '1rem', fontWeight: 600 }}>
                              ${transaction.amount.toFixed(2)} {transaction.currency}
                            </td>
                            <td style={{ padding: '1rem', color: 'var(--warning-color)' }}>
                              ${(transaction.fee || 0).toFixed(2)}
                            </td>
                            <td style={{ padding: '1rem' }}>{getStatusBadge(transaction.status)}</td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                              {transaction.description || 'N/A'}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default ModernTransactions;

