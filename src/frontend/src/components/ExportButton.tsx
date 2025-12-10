import React from 'react';
import { Button } from 'react-bootstrap';
import { FaDownload, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ExportButtonProps {
  data: any[];
  filename: string;
  type?: 'csv' | 'pdf';
  onExport?: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename, type = 'csv', onExport }) => {
  const exportToCSV = () => {
    if (data.length === 0) {
      toast.warning('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Data exported successfully! 🎉');
    if (onExport) onExport();
  };

  const exportToPDF = () => {
    toast.info('PDF export coming soon!');
    // PDF generation would require a library like jsPDF or pdfmake
  };

  const handleExport = () => {
    if (type === 'csv') {
      exportToCSV();
    } else {
      exportToPDF();
    }
  };

  const Icon = type === 'csv' ? FaFileExcel : FaFilePdf;

  return (
    <Button
      variant="outline-primary"
      className="btn-modern"
      onClick={handleExport}
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
    >
      <Icon />
      Export {type.toUpperCase()}
    </Button>
  );
};

export default ExportButton;


