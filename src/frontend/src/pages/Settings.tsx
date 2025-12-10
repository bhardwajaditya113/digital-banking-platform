import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Tabs, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { FaUser, FaLock, FaBell, FaPalette, FaShieldAlt, FaCreditCard } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import '../styles/theme.css';

const Settings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    theme: 'light'
  });

  const handleSubmit = (e: React.FormEvent, section: string) => {
    e.preventDefault();
    toast.success(`${section} updated successfully! 🎉`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Container fluid className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <h1 className="gradient-text mb-2" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            Settings
          </h1>
          <p className="text-muted">Manage your account settings and preferences</p>
        </div>

        <Row>
          <Col lg={3} className="mb-4">
            <Card className="modern-card">
              <Card.Body style={{ padding: '1.5rem' }}>
                <div className="text-center mb-4">
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      margin: '0 auto 1rem',
                      background: 'var(--primary-gradient)',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '2.5rem',
                      fontWeight: 700
                    }}
                  >
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <h5 className="mb-1">{user?.firstName} {user?.lastName}</h5>
                  <p className="text-muted small mb-0">{user?.email}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            <Card className="modern-card">
              <Card.Body style={{ padding: 0 }}>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k || 'profile')}
                  className="border-bottom"
                  style={{ padding: '0 1.5rem', marginTop: '1rem' }}
                >
                  <Tab eventKey="profile" title={
                    <span className="d-flex align-items-center">
                      <FaUser style={{ marginRight: '0.5rem' }} />
                      Profile
                    </span>
                  }>
                    <div style={{ padding: '2rem' }}>
                      <Form onSubmit={(e) => handleSubmit(e, 'Profile')}>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold">First Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="modern-input"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="fw-semibold">Last Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="modern-input"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="modern-input"
                          />
                        </Form.Group>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="modern-input"
                          />
                        </Form.Group>
                        <Button type="submit" className="btn-modern btn-gradient">
                          Save Changes
                        </Button>
                      </Form>
                    </div>
                  </Tab>

                  <Tab eventKey="security" title={
                    <span className="d-flex align-items-center">
                      <FaLock style={{ marginRight: '0.5rem' }} />
                      Security
                    </span>
                  }>
                    <div style={{ padding: '2rem' }}>
                      <Form onSubmit={(e) => handleSubmit(e, 'Password')}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">Current Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="modern-input"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-semibold">New Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className="modern-input"
                          />
                        </Form.Group>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="modern-input"
                          />
                        </Form.Group>
                        <Alert variant="info" className="modern-card mb-4">
                          <FaShieldAlt style={{ marginRight: '0.5rem' }} />
                          <strong>Password Requirements:</strong>
                          <ul className="mb-0 mt-2 small">
                            <li>At least 8 characters</li>
                            <li>One uppercase letter</li>
                            <li>One lowercase letter</li>
                            <li>One number</li>
                            <li>One special character</li>
                          </ul>
                        </Alert>
                        <Button type="submit" className="btn-modern btn-gradient">
                          Update Password
                        </Button>
                      </Form>
                    </div>
                  </Tab>

                  <Tab eventKey="notifications" title={
                    <span className="d-flex align-items-center">
                      <FaBell style={{ marginRight: '0.5rem' }} />
                      Notifications
                    </span>
                  }>
                    <div style={{ padding: '2rem' }}>
                      <Form onSubmit={(e) => handleSubmit(e, 'Notifications')}>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="switch"
                            id="email-notifications"
                            name="email"
                            label="Email Notifications"
                            checked={formData.notifications.email}
                            onChange={handleChange}
                            className="mb-3"
                          />
                          <Form.Text className="text-muted">
                            Receive notifications about account activity via email
                          </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="switch"
                            id="sms-notifications"
                            name="sms"
                            label="SMS Notifications"
                            checked={formData.notifications.sms}
                            onChange={handleChange}
                            className="mb-3"
                          />
                          <Form.Text className="text-muted">
                            Receive important alerts via SMS
                          </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-4">
                          <Form.Check
                            type="switch"
                            id="push-notifications"
                            name="push"
                            label="Push Notifications"
                            checked={formData.notifications.push}
                            onChange={handleChange}
                            className="mb-3"
                          />
                          <Form.Text className="text-muted">
                            Receive push notifications in your browser
                          </Form.Text>
                        </Form.Group>
                        <Button type="submit" className="btn-modern btn-gradient">
                          Save Preferences
                        </Button>
                      </Form>
                    </div>
                  </Tab>

                  <Tab eventKey="preferences" title={
                    <span className="d-flex align-items-center">
                      <FaPalette style={{ marginRight: '0.5rem' }} />
                      Preferences
                    </span>
                  }>
                    <div style={{ padding: '2rem' }}>
                      <Form onSubmit={(e) => handleSubmit(e, 'Preferences')}>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold mb-3">Theme</Form.Label>
                          <div className="d-flex gap-3 align-items-center">
                            <Form.Check
                              type="radio"
                              id="theme-light"
                              name="theme"
                              value="light"
                              label="Light"
                              checked={formData.theme === 'light'}
                              onChange={handleChange}
                            />
                            <Form.Check
                              type="radio"
                              id="theme-dark"
                              name="theme"
                              value="dark"
                              label="Dark"
                              checked={formData.theme === 'dark'}
                              onChange={handleChange}
                            />
                            <div className="ms-3">
                              <small className="text-muted">Or use the toggle in the navbar</small>
                            </div>
                          </div>
                        </Form.Group>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">Currency Preference</Form.Label>
                          <Form.Select className="modern-input">
                            <option>USD - US Dollar</option>
                            <option>EUR - Euro</option>
                            <option>GBP - British Pound</option>
                            <option>AED - UAE Dirham</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">Language</Form.Label>
                          <Form.Select className="modern-input">
                            <option>English</option>
                            <option>Arabic</option>
                            <option>French</option>
                            <option>Spanish</option>
                          </Form.Select>
                        </Form.Group>
                        <Button type="submit" className="btn-modern btn-gradient">
                          Save Preferences
                        </Button>
                      </Form>
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default Settings;

