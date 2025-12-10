import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import apiClient from '../services/api';

interface Loan {
  id: string;
  userId: string;
  loanNumber: string;
  loanType: string;
  principalAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  remainingBalance: number;
  status: string;
  approvedDate: string | null;
  maturityDate: string | null;
  payments: LoanPayment[];
}

interface LoanPayment {
  id: string;
  amount: number;
  paymentDate: string;
  paymentType: string;
  status: string;
}

const Loans: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    loanType: 'Personal',
    principalAmount: '',
    interestRate: '',
    termMonths: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchLoans();
    }
  }, [user]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/loan/user/${user?.id}`);
      setLoans(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLoan = async () => {
    try {
      setError(null);
      const response = await apiClient.post('/api/loan', {
        loanType: formData.loanType,
        principalAmount: parseFloat(formData.principalAmount),
        interestRate: parseFloat(formData.interestRate),
        termMonths: parseInt(formData.termMonths),
      });
      setLoans([...loans, response.data]);
      setShowCreateModal(false);
      setFormData({ loanType: 'Personal', principalAmount: '', interestRate: '', termMonths: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create loan application');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      Pending: 'warning',
      Approved: 'success',
      Active: 'primary',
      PaidOff: 'success',
      Defaulted: 'danger',
    };
    return variants[status] || 'secondary';
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Loans</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          Apply for Loan
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {loans.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <Card.Text>No loans found. Apply for your first loan to get started.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Loan Number</th>
              <th>Type</th>
              <th>Principal Amount</th>
              <th>Interest Rate</th>
              <th>Term (Months)</th>
              <th>Monthly Payment</th>
              <th>Remaining Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.loanNumber}</td>
                <td>{loan.loanType}</td>
                <td>${loan.principalAmount.toFixed(2)}</td>
                <td>{loan.interestRate.toFixed(2)}%</td>
                <td>{loan.termMonths}</td>
                <td>${loan.monthlyPayment.toFixed(2)}</td>
                <td>${loan.remainingBalance.toFixed(2)}</td>
                <td>
                  <span className={`badge bg-${getStatusBadge(loan.status)}`}>
                    {loan.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {loading && <div className="text-center mt-4">Loading...</div>}

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Apply for Loan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Loan Type</Form.Label>
              <Form.Select
                value={formData.loanType}
                onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
              >
                <option value="Personal">Personal</option>
                <option value="Mortgage">Mortgage</option>
                <option value="Auto">Auto</option>
                <option value="Business">Business</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Principal Amount ($)</Form.Label>
              <Form.Control
                type="number"
                value={formData.principalAmount}
                onChange={(e) => setFormData({ ...formData, principalAmount: e.target.value })}
                placeholder="Enter loan amount"
                min="1000"
                step="100"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Interest Rate (%)</Form.Label>
              <Form.Control
                type="number"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="Enter interest rate"
                min="0"
                max="30"
                step="0.1"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Term (Months)</Form.Label>
              <Form.Control
                type="number"
                value={formData.termMonths}
                onChange={(e) => setFormData({ ...formData, termMonths: e.target.value })}
                placeholder="Enter loan term in months"
                min="12"
                max="360"
                step="12"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateLoan}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Loans;


