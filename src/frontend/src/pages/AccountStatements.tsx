import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { FaFilePdf, FaPrint, FaDownload, FaCalendarAlt, FaWallet } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import apiClient from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/theme.css';

interface Statement {
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference: string;
}

const AccountStatements: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { accounts } = useSelector((state: RootState) => state.account);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [statements, setStatements] = useState<Statement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedAccount && startDate && endDate) {
      fetchStatements();
    }
  }, [selectedAccount, startDate, endDate]);

  const fetchStatements = async () => {
    try {
      setLoading(true);
      // In a real app, this would call the backend API
      // For now, we'll simulate with transaction data
      const response = await apiClient.get(`/api/transaction/account/${selectedAccount}`);
      const transactions = response.data || [];
      
      // Transform transactions into statement format
      let runningBalance = accounts.find(a => a.id === selectedAccount)?.balance || 0;
      const statementData: Statement[] = transactions
        .map((t: any) => {
          const isDebit = t.fromAccountId === selectedAccount;
          const amount = isDebit ? t.amount : 0;
          const credit = !isDebit ? t.amount : 0;
          runningBalance = isDebit ? runningBalance - amount - (t.fee || 0) : runningBalance + credit;
          
          return {
            date: t.createdAt,
            description: t.description || `${t.transactionType} Transaction`,
            debit: amount + (isDebit ? (t.fee || 0) : 0),
            credit: credit,
            balance: runningBalance,
            reference: t.referenceNumber || 'N/A'
          };
        })
        .reverse();
      
      setStatements(statementData);
    } catch (error: any) {
      toast.error('Failed to fetch statements');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!selectedAccount) {
      toast.warning('Please select an account');
      return;
    }

    const account = accounts.find(a => a.id === selectedAccount);
    if (!account) return;

    try {
      toast.info('Generating PDF...');
      const statementElement = document.getElementById('statement-content');
      if (!statementElement) return;

      const canvas = await html2canvas(statementElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`statement_${account.accountNumber}_${startDate}_to_${endDate}.pdf`);
      toast.success('PDF generated successfully! 🎉');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const openingBalance = accounts.find(a => a.id === selectedAccount)?.balance || 0;
  const totalDebits = statements.reduce((sum, s) => sum + s.debit, 0);
  const totalCredits = statements.reduce((sum, s) => sum + s.credit, 0);
  const closingBalance = openingBalance - totalDebits + totalCredits;

  return (
    <Container fluid className="py-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <h1 className="gradient-text mb-2" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            Account Statements
          </h1>
          <p className="text-muted">View and download your account statements</p>
        </div>

        {/* Filters */}
        <Card className="modern-card mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    <FaWallet style={{ marginRight: '0.5rem' }} />
                    Select Account
                  </Form.Label>
                  <Form.Select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="modern-input"
                  >
                    <option value="">Choose an account...</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.accountNumber} - {account.accountType} ({account.currency})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                    Start Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="modern-input"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                    End Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="modern-input"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Actions */}
        {selectedAccount && statements.length > 0 && (
          <div className="d-flex gap-2 mb-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="btn-modern btn-gradient" onClick={generatePDF}>
                <FaFilePdf style={{ marginRight: '0.5rem' }} />
                Download PDF
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline-primary" className="btn-modern" onClick={handlePrint}>
                <FaPrint style={{ marginRight: '0.5rem' }} />
                Print
              </Button>
            </motion.div>
          </div>
        )}

        {/* Statement Content */}
        {loading ? (
          <LoadingSpinner />
        ) : selectedAccount && statements.length > 0 ? (
          <div id="statement-content">
            <Card className="modern-card">
              <Card.Body style={{ padding: '2rem' }}>
                {/* Statement Header */}
                <div className="text-center mb-4 pb-4 border-bottom">
                  <h3 className="fw-bold mb-2">Account Statement</h3>
                  <p className="text-muted mb-1">
                    {accounts.find(a => a.id === selectedAccount)?.accountNumber}
                  </p>
                  <p className="text-muted small">
                    {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Account Summary */}
                <Row className="mb-4">
                  <Col md={4}>
                    <div className="text-center p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
                      <p className="text-muted small mb-1">Opening Balance</p>
                      <h5 className="fw-bold">${openingBalance.toFixed(2)}</h5>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
                      <p className="text-muted small mb-1">Total Debits</p>
                      <h5 className="fw-bold text-danger">${totalDebits.toFixed(2)}</h5>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="text-center p-3" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)' }}>
                      <p className="text-muted small mb-1">Total Credits</p>
                      <h5 className="fw-bold text-success">${totalCredits.toFixed(2)}</h5>
                    </div>
                  </Col>
                </Row>

                {/* Statement Table */}
                <div style={{ overflowX: 'auto' }}>
                  <Table hover className="mb-0">
                    <thead style={{ background: 'var(--bg-tertiary)' }}>
                      <tr>
                        <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
                        <th style={{ padding: '1rem', fontWeight: 600 }}>Description</th>
                        <th style={{ padding: '1rem', fontWeight: 600 }}>Reference</th>
                        <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Debit</th>
                        <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Credit</th>
                        <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statements.map((statement, index) => (
                        <tr key={index}>
                          <td style={{ padding: '1rem' }}>
                            {new Date(statement.date).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1rem' }}>{statement.description}</td>
                          <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {statement.reference}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', color: statement.debit > 0 ? 'var(--danger-color)' : 'transparent' }}>
                            {statement.debit > 0 ? `$${statement.debit.toFixed(2)}` : '-'}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', color: statement.credit > 0 ? 'var(--success-color)' : 'transparent' }}>
                            {statement.credit > 0 ? `$${statement.credit.toFixed(2)}` : '-'}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>
                            ${statement.balance.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot style={{ background: 'var(--bg-tertiary)', fontWeight: 600 }}>
                      <tr>
                        <td colSpan={3} style={{ padding: '1rem' }}>Closing Balance</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>${totalDebits.toFixed(2)}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>${totalCredits.toFixed(2)}</td>
                        <td style={{ padding: '1rem', textAlign: 'right' }}>${closingBalance.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </div>
        ) : selectedAccount ? (
          <Card className="modern-card text-center" style={{ padding: '4rem 2rem' }}>
            <FaFilePdf size={64} className="text-muted mb-3 opacity-50" />
            <h4 className="mb-2">No transactions found</h4>
            <p className="text-muted">No transactions for the selected date range.</p>
          </Card>
        ) : (
          <Card className="modern-card text-center" style={{ padding: '4rem 2rem' }}>
            <FaWallet size={64} className="text-muted mb-3 opacity-50" />
            <h4 className="mb-2">Select an account</h4>
            <p className="text-muted">Please select an account and date range to view statements.</p>
          </Card>
        )}
      </motion.div>
    </Container>
  );
};

export default AccountStatements;


