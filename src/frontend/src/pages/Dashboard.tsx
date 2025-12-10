import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchAccounts } from '../store/slices/accountSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { accounts, loading } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAccounts(user.id));
    }
  }, [dispatch, user]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <Container className="mt-4">
      <h2>Dashboard</h2>
      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Balance</Card.Title>
              <Card.Text className="h3">${totalBalance.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Active Accounts</Card.Title>
              <Card.Text className="h3">{accounts.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Welcome</Card.Title>
              <Card.Text>{user?.firstName} {user?.lastName}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {loading && <div className="text-center mt-4">Loading...</div>}
    </Container>
  );
};

export default Dashboard;


