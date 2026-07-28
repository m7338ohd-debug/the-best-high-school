import React, { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card/Card';
import { Button } from '../../../shared/components/ui/Button/Button';
import { Input } from '../../../shared/components/ui/Input/Input';
import { FileText, Download, Printer, CheckCircle2 } from 'lucide-react';
import styles from './ReportsDashboardPage.module.css';

export const ReportsDashboardPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('daily');
  const [reportDate, setReportDate] = useState('2026-07-27');
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleExport = (format: 'PDF' | 'CSV' | 'EXCEL') => {
    setExportSuccess(`Exported ${selectedReport.toUpperCase()} report as ${format} successfully!`);
    setTimeout(() => setExportSuccess(null), 3000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Enterprise Financial Reporting & Export Center</h2>
          <p className={styles.subtitle}>Generate, print, and export compliance reports for collections, receipts, defaulters, and cash registers</p>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Report Selector */}
        <Card title="Available Financial Reports">
          <div className={styles.reportList}>
            {[
              { id: 'daily', name: 'Daily Collection Register', desc: 'Detailed breakdown of all collections today' },
              { id: 'monthly', name: 'Monthly Fee Collection Summary', desc: 'Class-wise monthly fee collection totals' },
              { id: 'receipts', name: 'Sequential Receipt Register', desc: 'Full log of issued receipts (REC-2026-XXXXXX)' },
              { id: 'defaulters', name: 'Defaulter & Aging Balance List', desc: 'Students with overdue fee balances' },
              { id: 'cashbook', name: 'Daily Cash Counter Book', desc: 'Accountant opening & closing cash log' },
            ].map((report) => (
              <div
                key={report.id}
                className={`${styles.reportItem} ${selectedReport === report.id ? styles.activeReport : ''}`}
                onClick={() => setSelectedReport(report.id)}
              >
                <FileText size={18} className={styles.reportIcon} />
                <div>
                  <h4 className={styles.reportName}>{report.name}</h4>
                  <p className={styles.reportDesc}>{report.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Exporter Controls */}
        <Card title="Report Export Controls">
          <div className={styles.exportForm}>
            <Input
              label="Report Target Date"
              type="date"
              value={reportDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReportDate(e.target.value)}
            />

            <div className={styles.buttonGroup}>
              <Button variant="primary" leftIcon={<Download size={16} />} onClick={() => handleExport('PDF')}>
                Download PDF Report
              </Button>
              <Button variant="outline" leftIcon={<Download size={16} />} onClick={() => handleExport('CSV')}>
                Export CSV Spreadsheet
              </Button>
              <Button variant="outline" leftIcon={<Download size={16} />} onClick={() => handleExport('EXCEL')}>
                Export Excel File
              </Button>
              <Button variant="outline" leftIcon={<Printer size={16} />} onClick={() => handleExport('PDF')}>
                Print Report Directly
              </Button>
            </div>

            {exportSuccess && (
              <div className={styles.toast}>
                <CheckCircle2 size={16} /> {exportSuccess}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
