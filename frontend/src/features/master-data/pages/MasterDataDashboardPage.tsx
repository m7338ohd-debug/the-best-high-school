import React, { useState } from 'react';
import { Card } from '../../../shared/components/ui/Card/Card';
import { Button } from '../../../shared/components/ui/Button/Button';
import { Input } from '../../../shared/components/ui/Input/Input';
import { DataTable, Column } from '../../../shared/components/ui/DataTable/DataTable';
import { Layers, ListPlus, Bookmark, PlusCircle } from 'lucide-react';
import styles from './MasterDataDashboardPage.module.css';

interface MasterClassRow {
  id: string;
  className: string;
  displayName: string;
  sectionsCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

const mockClasses: MasterClassRow[] = [
  { id: '1', className: 'Class 10', displayName: 'Grade 10 (Secondary)', sectionsCount: 4, status: 'ACTIVE' },
  { id: '2', className: 'Class 9', displayName: 'Grade 9 (Secondary)', sectionsCount: 4, status: 'ACTIVE' },
  { id: '3', className: 'Class 8', displayName: 'Grade 8 (Middle)', sectionsCount: 3, status: 'ACTIVE' },
  { id: '4', className: 'Class 7', displayName: 'Grade 7 (Middle)', sectionsCount: 3, status: 'ACTIVE' },
  { id: '5', className: 'LKG', displayName: 'Lower Kindergarten', sectionsCount: 2, status: 'ACTIVE' },
];

const columns: Column<MasterClassRow>[] = [
  { key: 'className', header: 'Class Name', sortable: true },
  { key: 'displayName', header: 'Display Title', sortable: true },
  { key: 'sectionsCount', header: 'Sections Count', sortable: true },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    accessor: (item) => (
      <span
        style={{
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 700,
          backgroundColor: '#dcfce7',
          color: '#166534',
        }}
      >
        {item.status}
      </span>
    ),
  },
];

export const MasterDataDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'classes' | 'categories' | 'terms'>('classes');
  const [newClassName, setNewClassName] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Master Data Foundation Management</h2>
          <p className={styles.subtitle}>Configure school classes, sections, fee categories, and master registries</p>
        </div>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'classes' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('classes')}
        >
          <Layers size={16} /> Classes & Sections
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'categories' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Bookmark size={16} /> Fee Categories
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'terms' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('terms')}
        >
          <ListPlus size={16} /> Academic Terms
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'classes' && (
          <div className={styles.grid}>
            {/* Class Creator */}
            <Card title="Add New School Class">
              <form className={styles.form}>
                <Input
                  label="Class Name"
                  placeholder="e.g. Class 11"
                  value={newClassName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewClassName(e.target.value)}
                />
                <Input
                  label="Display Title"
                  placeholder="e.g. Grade 11 Higher Secondary"
                  value={newDisplayName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDisplayName(e.target.value)}
                />
                <Button variant="primary" leftIcon={<PlusCircle size={16} />}>
                  Create Class Master
                </Button>
              </form>
            </Card>

            {/* Master Classes Table */}
            <DataTable
              title="Active School Classes"
              data={mockClasses}
              columns={columns}
              keyExtractor={(item) => item.id}
            />
          </div>
        )}

        {activeTab === 'categories' && (
          <Card title="Fee Category Registry">
            <div className={styles.categoryGrid}>
              {[
                { name: 'Tuition Fee', code: 'TUITION', type: 'Recurring' },
                { name: 'Admission Fee', code: 'ADMISSION', type: 'One-Time' },
                { name: 'Transport Fee', code: 'TRANSPORT', type: 'Recurring' },
                { name: 'Laboratory Fee', code: 'LABORATORY', type: 'Recurring' },
                { name: 'Examination Fee', code: 'EXAM', type: 'Term-Based' },
              ].map((cat, idx) => (
                <div key={idx} className={styles.categoryItem}>
                  <div>
                    <h4 className={styles.catName}>{cat.name}</h4>
                    <span className={styles.catCode}>{cat.code}</span>
                  </div>
                  <span className={styles.badge}>{cat.type}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'terms' && (
          <Card title="Academic Terms Configuration">
            <div className={styles.termList}>
              <div className={styles.termRow}>
                <div>
                  <strong>Term 1 (First Term)</strong>
                  <p>Jul 1, 2026 – Oct 31, 2026</p>
                </div>
                <span className={styles.badge}>CURRENT TERM</span>
              </div>
              <div className={styles.termRow}>
                <div>
                  <strong>Term 2 (Mid Term)</strong>
                  <p>Nov 1, 2026 – Feb 28, 2027</p>
                </div>
                <Button variant="outline" size="sm">Set Current</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
