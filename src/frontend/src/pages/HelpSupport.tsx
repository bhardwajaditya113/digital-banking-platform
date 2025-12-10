import React, { useState } from 'react';
import { Container, Row, Col, Card, Accordion, Form, Button, InputGroup } from 'react-bootstrap';
import { FaQuestionCircle, FaEnvelope, FaPhone, FaComments, FaSearch, FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/theme.css';

const HelpSupport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: 'How do I create a new account?',
      answer: 'To create a new account, go to the Accounts page and click "Create New Account". Select your account type (Savings, Checking, or Investment) and currency, then confirm the creation.'
    },
    {
      question: 'How do I transfer money?',
      answer: 'Navigate to the Transfer page, select your source account, enter the recipient account ID, amount, and optional description. Review the transfer summary and confirm the transaction.'
    },
    {
      question: 'What are the transaction fees?',
      answer: 'Transaction fees are 1% of the transfer amount with a minimum fee of $0.50. Fees are calculated automatically and shown in the transfer summary before confirmation.'
    },
    {
      question: 'How do I view my transaction history?',
      answer: 'Go to the Transactions page and select an account from your accounts list. You can filter transactions by status, type, or search by reference number or description.'
    },
    {
      question: 'How do I apply for a loan?',
      answer: 'Visit the Loans page and click "Apply for Loan". Fill in the loan type, principal amount, interest rate, and term. The system will calculate your monthly payment automatically.'
    },
    {
      question: 'How do I create an investment portfolio?',
      answer: 'Go to the Investments page and click "Create Portfolio". Enter a name for your portfolio and confirm. You can then add investments to your portfolio.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption, JWT authentication, and follow banking security best practices to protect your financial data.'
    },
    {
      question: 'How do I change my password?',
      answer: 'Go to Settings > Security tab, enter your current password, then your new password twice. Make sure your new password meets the security requirements.'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    alert('Thank you for contacting us! We will get back to you soon.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
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
            Help & Support
          </h1>
          <p className="text-muted">Find answers to common questions or contact our support team</p>
        </div>

        {/* Search Bar */}
        <Card className="modern-card mb-4">
          <Card.Body>
            <InputGroup>
              <InputGroup.Text style={{ background: 'transparent', border: 'none' }}>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input"
                style={{ border: 'none', boxShadow: 'none' }}
              />
            </InputGroup>
          </Card.Body>
        </Card>

        <Row>
          <Col lg={8}>
            <Card className="modern-card mb-4">
              <Card.Header style={{ background: 'transparent', borderBottom: '1px solid var(--border-color)', padding: '1.5rem' }}>
                <h4 className="mb-0 fw-bold d-flex align-items-center">
                  <FaQuestionCircle style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }} />
                  Frequently Asked Questions
                </h4>
              </Card.Header>
              <Card.Body style={{ padding: '1.5rem' }}>
                <Accordion>
                  {filteredFAQs.map((faq, index) => (
                    <Accordion.Item eventKey={index.toString()} key={index} className="mb-2" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                      <Accordion.Header style={{ fontWeight: 600 }}>
                        {faq.question}
                      </Accordion.Header>
                      <Accordion.Body style={{ color: 'var(--text-secondary)' }}>
                        {faq.answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
                {filteredFAQs.length === 0 && (
                  <div className="text-center py-5">
                    <FaQuestionCircle size={48} className="text-muted mb-3 opacity-50" />
                    <p className="text-muted">No results found. Try a different search term.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="modern-card mb-4">
              <Card.Header style={{ background: 'transparent', borderBottom: '1px solid var(--border-color)', padding: '1.5rem' }}>
                <h5 className="mb-0 fw-bold">Contact Support</h5>
              </Card.Header>
              <Card.Body style={{ padding: '1.5rem' }}>
                <div className="mb-4">
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
                      <FaEnvelope size={20} />
                    </div>
                    <div>
                      <strong>Email</strong>
                      <p className="mb-0 text-muted small">support@bankingplatform.com</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div
                      style={{
                        background: 'var(--success-gradient)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '0.75rem',
                        color: 'white',
                        marginRight: '1rem'
                      }}
                    >
                      <FaPhone size={20} />
                    </div>
                    <div>
                      <strong>Phone</strong>
                      <p className="mb-0 text-muted small">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        background: 'var(--secondary-gradient)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '0.75rem',
                        color: 'white',
                        marginRight: '1rem'
                      }}
                    >
                      <FaComments size={20} />
                    </div>
                    <div>
                      <strong>Live Chat</strong>
                      <p className="mb-0 text-muted small">Available 24/7</p>
                    </div>
                  </div>
                </div>

                <Form onSubmit={handleContactSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="modern-input"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="modern-input"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Subject</Form.Label>
                    <Form.Control
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="modern-input"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="modern-input"
                      required
                    />
                  </Form.Group>
                  <Button type="submit" className="btn-modern btn-gradient w-100">
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default HelpSupport;


