import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchAccounts } from '../store/slices/accountSlice';
import { FaWallet, FaChartLine, FaArrowUp, FaArrowDown, FaPiggyBank } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/theme.css';

const ModernDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { accounts, loading } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAccounts(user.id));
    }
  }, [dispatch, user]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalAvailable = accounts.reduce((sum, account) => sum + account.availableBalance, 0);
  const activeAccounts = accounts.length;

  // Sample data for charts
  const transactionData = [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 5000 },
    { name: 'Apr', amount: 4500 },
    { name: 'May', amount: 6000 },
    { name: 'Jun', amount: 5500 },
  ];

  const accountDistribution = accounts.map(acc => ({
    name: acc.accountType,
    value: acc.balance
  }));

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

  const statCards = [
    {
      title: 'Total Balance',
      value: `$${totalBalance.toFixed(2)}`,
      icon: FaWallet,
      gradient: 'var(--primary-gradient)',
      change: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Available Balance',
      value: `$${totalAvailable.toFixed(2)}`,
      icon: FaPiggyBank,
      gradient: 'var(--success-gradient)',
      change: '+8.2%',
      trend: 'up'
    },
    {
      title: 'Active Accounts',
      value: activeAccounts.toString(),
      icon: FaChartLine,
      gradient: 'var(--secondary-gradient)',
      change: '+2',
      trend: 'up'
    },
    {
      title: 'Monthly Growth',
      value: '15.3%',
      icon: FaArrowUp,
      gradient: 'var(--warning-gradient)',
      change: '+3.1%',
      trend: 'up'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="mb-4">
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>
            Here's your financial overview for today
          </p>
        </motion.div>

        {/* Stat Cards */}
        <Row className="g-4 mb-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Col xs={12} sm={6} lg={3} key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="stat-card h-100" style={{ borderLeft: `4px solid ${stat.gradient.split(' ')[1]}` }}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div
                          style={{
                            background: stat.gradient,
                            borderRadius: 'var(--radius-lg)',
                            padding: '0.75rem',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Icon size={24} />
                        </div>
                        <span
                          className={`d-flex align-items-center ${
                            stat.trend === 'up' ? 'text-success' : 'text-danger'
                          }`}
                          style={{ fontSize: '0.875rem', fontWeight: 600 }}
                        >
                          {stat.trend === 'up' ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                          {stat.change}
                        </span>
                      </div>
                      <h6 className="text-muted mb-2" style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {stat.title}
                      </h6>
                      <h3 className="mb-0" style={{ fontWeight: 700, fontSize: '1.75rem' }}>
                        {stat.value}
                      </h3>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            );
          })}
        </Row>

        {/* Charts Section */}
        <Row className="g-4">
          <Col xs={12} lg={8}>
            <motion.div variants={itemVariants}>
              <Card className="modern-card h-100">
                <Card.Header style={{ background: 'transparent', borderBottom: '1px solid var(--border-color)', padding: '1.5rem' }}>
                  <h5 className="mb-0 fw-bold">Transaction History</h5>
                  <small className="text-muted">Last 6 months</small>
                </Card.Header>
                <Card.Body style={{ padding: '1.5rem' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={transactionData}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-color)',
                          boxShadow: 'var(--shadow-lg)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#667eea"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          <Col xs={12} lg={4}>
            <motion.div variants={itemVariants}>
              <Card className="modern-card h-100">
                <Card.Header style={{ background: 'transparent', borderBottom: '1px solid var(--border-color)', padding: '1.5rem' }}>
                  <h5 className="mb-0 fw-bold">Account Distribution</h5>
                  <small className="text-muted">By balance</small>
                </Card.Header>
                <Card.Body style={{ padding: '1.5rem' }}>
                  {accountDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={accountDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {accountDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border-color)',
                            boxShadow: 'var(--shadow-lg)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-muted py-5">
                      <FaWallet size={48} className="mb-3 opacity-50" />
                      <p>No accounts yet</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {loading && <LoadingSpinner />}
      </motion.div>
    </Container>
  );
};

export default ModernDashboard;


