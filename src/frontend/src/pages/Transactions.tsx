import React, { useEffect } from 'react';
import { Container, Table, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { fetchTransactions } from '../store/slices/transactionSlice';

const Transactions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId');
  const { transactions, loading } = useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    if (accountId) {
      dispatch(fetchTransactions(accountId));
    }
  }, [dispatch, accountId]);

  return (
    <Container className="mt-4">
      <h2>Transactions</h2>
      {!accountId ? (
        <Card>
          <Card.Body className="text-center">
            <Card.Text>Please select an account to view transactions.</Card.Text>
          </Card.Body>
        </Card>
      ) : transactions.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <Card.Text>No transactions found.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Reference Number</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.referenceNumber || 'N/A'}</td>
                <td>{transaction.transactionType}</td>
                <td>${transaction.amount.toFixed(2)} {transaction.currency}</td>
                <td>
                  <span className={`badge ${transaction.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                <td>{transaction.description || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {loading && <div className="text-center mt-4">Loading...</div>}
    </Container>
  );
};

export default Transactions;


