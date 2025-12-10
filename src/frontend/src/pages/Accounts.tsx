import React, { useEffect } from 'react';
import { Container, Table, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { fetchAccounts, createAccount } from '../store/slices/accountSlice';

const Accounts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { accounts, loading } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAccounts(user.id));
    }
  }, [dispatch, user]);

  const handleCreateAccount = async () => {
    if (user?.id) {
      await dispatch(createAccount({ accountType: 'Savings', currency: 'USD' }));
      dispatch(fetchAccounts(user.id));
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Accounts</h2>
        <Button variant="primary" onClick={handleCreateAccount} disabled={loading}>
          Create New Account
        </Button>
      </div>
      {accounts.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <Card.Text>No accounts found. Create your first account to get started.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Type</th>
              <th>Currency</th>
              <th>Balance</th>
              <th>Available Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.accountNumber}</td>
                <td>{account.accountType}</td>
                <td>{account.currency}</td>
                <td>${account.balance.toFixed(2)}</td>
                <td>${account.availableBalance.toFixed(2)}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/transactions?accountId=${account.id}`)}
                  >
                    View Transactions
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {loading && <div className="text-center mt-4">Loading...</div>}
    </Container>
  );
};

export default Accounts;


