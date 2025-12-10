import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { fetchAccounts } from '../store/slices/accountSlice';
import { transfer } from '../store/slices/transactionSlice';

const Transfer: React.FC = () => {
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
    const result = await dispatch(transfer({
      fromAccountId: formData.fromAccountId,
      toAccountId: formData.toAccountId,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      description: formData.description,
    }));
    if (transfer.fulfilled.match(result)) {
      navigate('/transactions');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container className="mt-4">
      <h2>Transfer Money</h2>
      <Card className="mt-4">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>From Account</Form.Label>
              <Form.Select name="fromAccountId" value={formData.fromAccountId} onChange={handleChange} required>
                <option value="">Select account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountNumber} - {account.accountType} (${account.balance.toFixed(2)})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>To Account ID</Form.Label>
              <Form.Control
                type="text"
                name="toAccountId"
                value={formData.toAccountId}
                onChange={handleChange}
                placeholder="Enter recipient account ID"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Currency</Form.Label>
              <Form.Select name="currency" value={formData.currency} onChange={handleChange}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="AED">AED</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Transfer'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Transfer;

