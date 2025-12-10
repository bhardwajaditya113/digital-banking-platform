import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import apiClient from '../services/api';
import { FaChartLine, FaPlus, FaDollarSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/theme.css';

interface Portfolio {
  id: string;
  userId: string;
  name: string;
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  returnPercentage: number;
  investments: Investment[];
}

interface Investment {
  id: string;
  symbol: string;
  investmentType: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  totalValue: number;
  purchaseDate: string;
}

const Investments: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [portfolioName, setPortfolioName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchPortfolios();
    }
  }, [user]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/portfolio/user/${user?.id}`);
      setPortfolios(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch portfolios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async () => {
    try {
      setError(null);
      const response = await apiClient.post('/api/portfolio', { name: portfolioName });
      setPortfolios([...portfolios, response.data]);
      setShowCreateModal(false);
      setPortfolioName('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create portfolio');
    }
  };

  return (
    <Container fluid className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 className="gradient-text mb-2" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              Investment Portfolios
            </h1>
            <p className="text-muted">Manage your investment portfolios</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="btn-modern btn-gradient" onClick={() => setShowCreateModal(true)}>
              <FaPlus style={{ marginRight: '0.5rem' }} />
              Create Portfolio
            </Button>
          </motion.div>
        </div>

        {error && (
          <Alert variant="danger" className="modern-card mb-4" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : portfolios.length === 0 ? (
          <Card className="modern-card text-center" style={{ padding: '4rem 2rem' }}>
            <FaChartLine size={64} className="text-muted mb-3 opacity-50" />
            <h4 className="mb-2">No portfolios found</h4>
            <p className="text-muted mb-4">Create your first portfolio to get started.</p>
            <Button className="btn-modern btn-gradient" onClick={() => setShowCreateModal(true)}>
              <FaPlus style={{ marginRight: '0.5rem' }} />
              Create Portfolio
            </Button>
          </Card>
        ) : (
          portfolios.map((portfolio, index) => (
            <motion.div
              key={portfolio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="modern-card mb-4">
                <Card.Header style={{ background: 'var(--primary-gradient)', color: 'white', border: 'none' }}>
                  <h4 className="mb-0 fw-bold">{portfolio.name}</h4>
                </Card.Header>
                <Card.Body style={{ padding: '2rem' }}>
                  <Row className="g-4 mb-4">
                    <Col xs={12} sm={6} md={3}>
                      <div className="text-center">
                        <h6 className="text-muted mb-2">Total Value</h6>
                        <h4 className="fw-bold text-success">${portfolio.totalValue.toFixed(2)}</h4>
                      </div>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <div className="text-center">
                        <h6 className="text-muted mb-2">Total Invested</h6>
                        <h4 className="fw-bold">${portfolio.totalInvested.toFixed(2)}</h4>
                      </div>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <div className="text-center">
                        <h6 className="text-muted mb-2">Total Return</h6>
                        <h4 className={`fw-bold ${portfolio.totalReturn >= 0 ? 'text-success' : 'text-danger'}`}>
                          {portfolio.totalReturn >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                          ${Math.abs(portfolio.totalReturn).toFixed(2)}
                        </h4>
                      </div>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                      <div className="text-center">
                        <h6 className="text-muted mb-2">Return %</h6>
                        <h4 className={`fw-bold ${portfolio.returnPercentage >= 0 ? 'text-success' : 'text-danger'}`}>
                          {portfolio.returnPercentage.toFixed(2)}%
                        </h4>
                      </div>
                    </Col>
                  </Row>
                  {portfolio.investments.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <Table hover className="mb-0">
                        <thead style={{ background: 'var(--bg-tertiary)' }}>
                          <tr>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Symbol</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Type</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Quantity</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Purchase Price</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Current Price</th>
                            <th style={{ padding: '1rem', fontWeight: 600 }}>Total Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolio.investments.map((investment) => (
                            <tr key={investment.id}>
                              <td style={{ padding: '1rem', fontWeight: 600 }}>{investment.symbol}</td>
                              <td style={{ padding: '1rem' }}>{investment.investmentType}</td>
                              <td style={{ padding: '1rem' }}>{investment.quantity}</td>
                              <td style={{ padding: '1rem' }}>${investment.purchasePrice.toFixed(2)}</td>
                              <td style={{ padding: '1rem' }}>${investment.currentPrice.toFixed(2)}</td>
                              <td style={{ padding: '1rem', fontWeight: 600 }}>${investment.totalValue.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No investments in this portfolio yet.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          ))
        )}

        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
          <Modal.Header closeButton style={{ borderBottom: '1px solid var(--border-color)' }}>
            <Modal.Title className="fw-bold">Create New Portfolio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Portfolio Name</Form.Label>
                <Form.Control
                  type="text"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="Enter portfolio name"
                  className="modern-input"
                  style={{ padding: '0.875rem 1rem' }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: '1px solid var(--border-color)' }}>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button className="btn-modern btn-gradient" onClick={handleCreatePortfolio}>
              <FaPlus style={{ marginRight: '0.5rem' }} />
              Create
            </Button>
          </Modal.Footer>
        </Modal>
      </motion.div>
    </Container>
  );
};

export default Investments;

