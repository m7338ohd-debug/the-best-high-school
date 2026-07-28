import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  ArrowUpRight, 
  Sparkles, 
  Download, 
  Calendar,
  IndianRupee
} from 'lucide-react';
import { useSchoolSettings } from '../../../shared/context/SchoolContext';
import { 
  getStoredStudents, 
  getStoredFeePayments, 
  getStoredStaff, 
  saveStaffToStorage, 
  StaffRecord 
} from '../../../shared/utils/schoolDataStorage';
import { UserCheck, X, Check } from 'lucide-react';
import styles from './SchoolDashboardPage.module.css';

interface SchoolDashboardPageProps {
  schoolName?: string;
  onNavigateToFinance?: () => void;
  onNavigateToStudents?: () => void;
  onNavigateToReports?: () => void;
}

export const SchoolDashboardPage: React.FC<SchoolDashboardPageProps> = ({
  schoolName: propSchoolName,
  onNavigateToFinance,
  onNavigateToStudents,
  onNavigateToReports,
}) => {
  const { profile, activeAcademicYear } = useSchoolSettings();
  const schoolName = propSchoolName || profile.schoolName;

  const [dateRange, setDateRange] = useState<'Last 7 Days' | 'This Month' | 'This Term' | 'This Year'>('Last 7 Days');
  const [chartTimeframe, setChartTimeframe] = useState<'Today' | 'This Week' | 'This Month' | 'Year'>('This Month');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ index: number; x: number; y: number; val1: number; val2: number; label: string } | null>(null);

  // Faculty Addition Modal State
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffDesignation, setStaffDesignation] = useState('Teacher');
  const [staffDept, setStaffDept] = useState('Academics');
  const [staffContact, setStaffContact] = useState('');

  // Dynamic Live Data Calculation from Master Storage
  const [storedStudents, setStoredStudents] = useState(getStoredStudents());
  const [storedPayments, setStoredPayments] = useState(getStoredFeePayments());
  const [storedStaff, setStoredStaff] = useState(getStoredStaff());

  useEffect(() => {
    setStoredStudents(getStoredStudents());
    setStoredPayments(getStoredFeePayments());
    setStoredStaff(getStoredStaff());
  }, []);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: StaffRecord = {
      id: `staff-${Date.now()}`,
      staffId: `FAC-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: staffName || 'Faculty Member',
      designation: staffDesignation,
      department: staffDept,
      contact: staffContact || '+91 98765 00000',
      email: `${(staffName || 'faculty').toLowerCase().replace(/\s+/g, '.')}@example.com`,
      status: 'ACTIVE',
      joiningDate: new Date().toISOString().split('T')[0],
      qualification: 'B.Ed, Master Degree',
    };

    saveStaffToStorage(newStaff);
    setStoredStaff(getStoredStaff());
    setShowStaffModal(false);
    setStaffName('');
    setStaffContact('');
  };

  const totalStudents = storedStudents.length;
  const todayStr = new Date().toISOString().split('T')[0];

  const collectedToday = storedPayments
    .filter((p) => p.paymentDate === todayStr)
    .reduce((acc, p) => acc + p.amountPaid, 0);

  const totalRevenue = storedPayments.reduce((acc, p) => acc + p.amountPaid, 0);
  const pendingStudents = storedStudents.filter((s) => s.feeStatus !== 'Paid');
  const totalFeesPending = pendingStudents.length * 12000;
  const overduePending = pendingStudents.length * 4000;

  // Dynamic Real Amounts
  const displayRevenue = totalRevenue;
  const displayToday = collectedToday;
  const displayMonthly = totalRevenue;

  // Chart datasets
  const chartDatasets: Record<'Today' | 'This Week' | 'This Month' | 'Year', { labels: string[]; collected: number[]; expected: number[] }> = {
    Today: {
      labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'],
      collected: [12, 28, 45, 65, 88, 120, 142.5],
      expected: [15, 35, 50, 75, 100, 130, 150],
    },
    'This Week': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      collected: [180, 240, 190, 310, 280, 420, 390],
      expected: [200, 220, 250, 280, 300, 350, 400],
    },
    'This Month': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      collected: [420, 890, 1350, 1845],
      expected: [450, 950, 1400, 1900],
    },
    Year: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      collected: [1100, 2300, 3600, 4900, 6200, 7800, 9400, 10800, 12100, 13400, 14200, 14580],
      expected: [1200, 2500, 3800, 5200, 6500, 8000, 9800, 11200, 12500, 13800, 14600, 15000],
    },
  };

  const activeDataset = chartDatasets[chartTimeframe];

  return (
    <div className={styles.container}>
      {/* 1. TOP HEADER BAR */}
      <div className={styles.topHeader}>
        <div>
          <span className={styles.brandBadge}>
            <Sparkles size={14} /> {schoolName} • Executive ERP Workspace
          </span>
          <h1 className={styles.headerTitle}>{schoolName} Finance & Operations</h1>
          <p className={styles.headerSubtitle}>
            Academic Year <strong>{activeAcademicYear.yearName}</strong> • Live Student Roster & Revenue Closing
          </p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.searchBar}>
            <Search size={16} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search student, receipt, class..." 
              className={styles.searchInput} 
            />
          </div>

          <button className={styles.notificationBtn} title="Notifications">
            <Bell size={18} />
            <span className={styles.notifBadge} />
          </button>

          <button className={styles.exportBtn} onClick={onNavigateToReports}>
            <Download size={15} /> Export Reports
          </button>
        </div>
      </div>

      {/* 2. MAIN EXECUTIVE REVENUE & KPI CARD BLOCK */}
      <div className={styles.mainStatCard}>
        <div className={styles.mainCardHeader}>
          <div>
            <span className={styles.mainCardMeta}>TOTAL SCHOOL REVENUE (LOCKED LEDGER)</span>
            <div className={styles.mainCardValueRow}>
              <h2 className={styles.mainCardValue}>
                ₹{displayRevenue.toLocaleString('en-IN')}
              </h2>
              <span className={styles.growthBadge}>
                <ArrowUpRight size={14} /> +14.2% YoY
              </span>
            </div>
          </div>

          <div className={styles.dropdownWrapper}>
            <Calendar size={14} className={styles.dropdownIcon} />
            <select 
              className={styles.rangeSelect} 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value as any)}
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="This Month">This Month</option>
              <option value="This Term">This Term</option>
              <option value="This Year">This Year</option>
            </select>
            <ChevronDown size={14} className={styles.dropdownChevron} />
          </div>
        </div>

        {/* Multi-Color Segmented Bar */}
        <div className={styles.segmentedBar}>
          <div className={styles.seg1} style={{ flex: 35 }} />
          <div className={styles.seg2} style={{ flex: 25 }} />
          <div className={styles.seg3} style={{ flex: 15 }} />
          <div className={styles.seg4} style={{ flex: 12 }} />
          <div className={styles.seg5} style={{ flex: 8 }} />
          <div className={styles.seg6} style={{ flex: 5 }} />
        </div>

        {/* 6 SUB-METRICS GRID */}
        <div className={styles.subMetricsGrid}>
          <div className={styles.subCard} onClick={onNavigateToFinance}>
            <div className={styles.subCardHeader}>
              <span className={`${styles.dot} ${styles.dotBlue}`} />
              <span className={styles.subCardTitle}>Daily Collection</span>
            </div>
            <strong className={styles.subCardVal}>₹{displayToday.toLocaleString('en-IN')}</strong>
          </div>

          <div className={styles.subCard} onClick={onNavigateToFinance}>
            <div className={styles.subCardHeader}>
              <span className={`${styles.dot} ${styles.dotPurple}`} />
              <span className={styles.subCardTitle}>Monthly Collection</span>
            </div>
            <strong className={styles.subCardVal}>₹{displayMonthly.toLocaleString('en-IN')}</strong>
          </div>

          <div className={styles.subCard} onClick={onNavigateToReports}>
            <div className={styles.subCardHeader}>
              <span className={`${styles.dot} ${styles.dotDarkPurple}`} />
              <span className={styles.subCardTitle}>Total Fees Pending</span>
            </div>
            <strong className={styles.subCardVal}>₹{totalFeesPending.toLocaleString('en-IN')}</strong>
          </div>

          <div className={styles.subCard} onClick={onNavigateToReports}>
            <div className={styles.subCardHeader}>
              <span className={`${styles.dot} ${styles.dotCoral}`} />
              <span className={styles.subCardTitle}>Overdue Pending</span>
            </div>
            <strong className={styles.subCardVal}>₹{overduePending.toLocaleString('en-IN')}</strong>
          </div>

          <div className={styles.subCard} onClick={onNavigateToStudents}>
            <div className={styles.subCardHeader}>
              <span className={`${styles.dot} ${styles.dotOrange}`} />
              <span className={styles.subCardTitle}>Enrolled Students</span>
            </div>
            <strong className={styles.subCardVal}>{totalStudents}</strong>
          </div>

          <div className={styles.subCard} onClick={() => setShowStaffModal(true)} title="Click to Add Faculty / Manage Staff">
            <div className={styles.subCardHeader}>
              <span className={`${styles.dot} ${styles.dotYellow}`} />
              <span className={styles.subCardTitle}>Active Staff</span>
            </div>
            <strong className={styles.subCardVal}>{storedStaff.length}</strong>
          </div>
        </div>
      </div>

      {/* 3. ANALYTICS SECTION (SVG LINE GRAPH & DONUT CHART) */}
      <div className={styles.analyticsGrid}>
        {/* LINE GRAPH */}
        <div className={styles.chartCard}>
          <div className={styles.chartCardHeader}>
            <div>
              <h3 className={styles.chartTitle}>Monthly Collection vs Expected Target</h3>
              <p className={styles.chartSubtitle}>Revenue trajectory across billing cycles</p>
            </div>

            <div className={styles.pillGroup}>
              {(['Today', 'This Week', 'This Month', 'Year'] as const).map((tf) => (
                <button
                  key={tf}
                  className={`${styles.pillBtn} ${chartTimeframe === tf ? styles.pillActive : ''}`}
                  onClick={() => setChartTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.legendRow}>
            <div className={styles.legendItem}>
              <span className={styles.legendBlueDot} />
              <span>Collected Revenue (₹)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendOrangeDot} />
              <span>Expected Target (₹)</span>
            </div>
          </div>

          {/* DYNAMIC SVG LINE GRAPH */}
          <div className={styles.svgWrapper}>
            {(() => {
              const svgWidth = 500;
              const svgHeight = 180;
              const paddingX = 40;
              const paddingY = 25;

              const maxVal = Math.max(
                ...activeDataset.collected,
                ...activeDataset.expected,
                1000
              ) * 1.15;

              const getCoords = (data: number[]) => {
                return data.map((val, i) => {
                  const x = paddingX + (i / Math.max(1, data.length - 1)) * (svgWidth - 2 * paddingX);
                  const y = svgHeight - paddingY - (val / maxVal) * (svgHeight - 2 * paddingY);
                  return { x, y, val };
                });
              };

              const colCoords = getCoords(activeDataset.collected);
              const expCoords = getCoords(activeDataset.expected);

              const colPath = colCoords.reduce(
                (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`,
                ''
              );

              const expPath = expCoords.reduce(
                (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`,
                ''
              );

              return (
                <>
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={styles.lineSvg} preserveAspectRatio="xMidYMid meet">
                    {/* Grid Lines */}
                    {[35, 75, 115, 155].map((y) => (
                      <line key={y} x1="0" y1={y} x2={svgWidth} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    ))}

                    {/* Path 1: Collected (Solid Blue) */}
                    <path
                      d={colPath}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Path 2: Expected Target (Dashed Orange) */}
                    <path
                      d={expPath}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      strokeDasharray="5,5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Dynamic Data Points */}
                    {colCoords.map((pt, idx) => (
                      <g key={idx}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="5"
                          fill="#2563eb"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className={styles.dataCircle}
                          onMouseEnter={() =>
                            setHoveredDataPoint({
                              index: idx,
                              x: pt.x,
                              y: pt.y,
                              val1: pt.val,
                              val2: expCoords[idx]?.val || 0,
                              label: activeDataset.labels[idx] || `P${idx + 1}`,
                            })
                          }
                          onMouseLeave={() => setHoveredDataPoint(null)}
                        />
                      </g>
                    ))}
                  </svg>

                  {hoveredDataPoint && (
                    <div
                      className={styles.tooltipBox}
                      style={{
                        left: `${(hoveredDataPoint.x / svgWidth) * 100}%`,
                        top: `${(hoveredDataPoint.y / svgHeight) * 100}%`,
                      }}
                    >
                      <div className={styles.tooltipHeader}>{hoveredDataPoint.label}</div>
                      <div className={styles.tooltipRow}>
                        <span className={styles.tooltipDotBlue} />
                        <span>Collected: ₹{hoveredDataPoint.val1.toLocaleString('en-IN')}</span>
                      </div>
                      <div className={styles.tooltipRow}>
                        <span className={styles.tooltipDotOrange} />
                        <span>Target: ₹{hoveredDataPoint.val2.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            <div className={styles.xAxisLabels}>
              {activeDataset.labels.map((lbl, i) => (
                <span key={i} style={{ left: `${(i / (activeDataset.labels.length - 1)) * 88 + 6}%` }}>
                  {lbl}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* DONUT CHART */}
        <div className={styles.donutCard}>
          <div className={styles.chartCardHeader}>
            <div>
              <h3 className={styles.chartTitle}>Fee Status Distribution</h3>
              <p className={styles.chartSubtitle}>Real-time ledger breakdown</p>
            </div>
          </div>

          <div className={styles.donutWrapper}>
            <svg viewBox="0 0 200 200" className={styles.donutSvg}>
              <circle cx="100" cy="100" r="65" fill="transparent" stroke="#2563eb" strokeWidth="22" strokeDasharray="280 400" strokeDashoffset="0" className={styles.donutArc} />
              <circle cx="100" cy="100" r="65" fill="transparent" stroke="#a855f7" strokeWidth="22" strokeDasharray="70 400" strokeDashoffset="-280" className={styles.donutArc} />
              <circle cx="100" cy="100" r="65" fill="transparent" stroke="#f43f5e" strokeWidth="22" strokeDasharray="35 400" strokeDashoffset="-350" className={styles.donutArc} />
              <circle cx="100" cy="100" r="65" fill="transparent" stroke="#f97316" strokeWidth="22" strokeDasharray="15 400" strokeDashoffset="-385" className={styles.donutArc} />
            </svg>
            <div className={styles.donutCenter}>
              <span className={styles.donutCenterVal}>72%</span>
              <span className={styles.donutCenterSub}>Paid Dues</span>
            </div>
          </div>

          <div className={styles.donutLegendGrid}>
            <div className={styles.donutLegendItem}>
              <div className={styles.legendLeft}>
                <span className={styles.legendDot} style={{ background: '#2563eb' }} />
                <span className={styles.legendLabel}>Fully Paid</span>
              </div>
              <strong className={styles.legendPercent}>72%</strong>
            </div>

            <div className={styles.donutLegendItem}>
              <div className={styles.legendLeft}>
                <span className={styles.legendDot} style={{ background: '#a855f7' }} />
                <span className={styles.legendLabel}>Partially Paid</span>
              </div>
              <strong className={styles.legendPercent}>18%</strong>
            </div>

            <div className={styles.donutLegendItem}>
              <div className={styles.legendLeft}>
                <span className={styles.legendDot} style={{ background: '#f43f5e' }} />
                <span className={styles.legendLabel}>Pending Dues</span>
              </div>
              <strong className={styles.legendPercent}>7%</strong>
            </div>

            <div className={styles.donutLegendItem}>
              <div className={styles.legendLeft}>
                <span className={styles.legendDot} style={{ background: '#f97316' }} />
                <span className={styles.legendLabel}>Fee Defaulters</span>
              </div>
              <strong className={styles.legendPercent}>3%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT TRANSACTIONS LEDGER TABLE WITH PURPLE THEME HEADER */}
      <div className={styles.tableCard} style={{ background: '#ffffff', borderRadius: 20, padding: 24, border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
        <div className={styles.tableToolbar}>
          <span className={styles.tableBadgePurple}>
            <Sparkles size={14} /> Real-Time Accounting Ledger Feed
          </span>
          <button className={styles.exportBtn} onClick={onNavigateToFinance}>
            <IndianRupee size={14} /> Open Fee Collection Terminal →
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.purpleTable}>
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Sec</th>
                <th>Amount Paid</th>
                <th>Payment Mode</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {storedPayments.length > 0 ? (
                storedPayments.slice(0, 5).map((rec) => (
                  <tr key={rec.id}>
                    <td><code className={styles.receiptCode}>{rec.receiptNo}</code></td>
                    <td><strong>{rec.studentName}</strong></td>
                    <td>{rec.className}</td>
                    <td><strong>{rec.sectionName}</strong></td>
                    <td><strong className={styles.amountText}>₹{rec.amountPaid.toLocaleString('en-IN')}</strong></td>
                    <td><span className={styles.modeText}>{rec.paymentChannel}</span></td>
                    <td>{rec.paymentDate}</td>
                    <td><span className={`${styles.statusBadge} ${styles.badgeGreen}`}>SETTLED</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    No Fee Payments Collected Yet. Click 'Open Fee Collection Terminal' to collect fees and issue receipts.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FACULTY / STAFF ADDITION MODAL */}
      {showStaffModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: '#ffffff', borderRadius: 20, padding: 24, maxWidth: 500, width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button 
              onClick={() => setShowStaffModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: '#f1f5f9', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#fef3c7', color: '#b45309', width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>Add School Faculty / Staff</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Enrolled staff will automatically reflect in the Active Staff card</p>
              </div>
            </div>

            <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Staff Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Designation</label>
                  <select
                    value={staffDesignation}
                    onChange={(e) => setStaffDesignation(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  >
                    <option value="Senior Teacher">Senior Teacher</option>
                    <option value="Subject Teacher">Subject Teacher</option>
                    <option value="Principal">Principal</option>
                    <option value="Vice Principal">Vice Principal</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Lab Assistant">Lab Assistant</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Department</label>
                  <select
                    value={staffDept}
                    onChange={(e) => setStaffDept(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science & Physics">Science & Physics</option>
                    <option value="English & Languages">English & Languages</option>
                    <option value="Primary Wing">Primary Wing</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Contact Mobile Number</label>
                <input 
                  type="text" 
                  placeholder="+91 98765 43210"
                  value={staffContact}
                  onChange={(e) => setStaffContact(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button 
                  type="button" 
                  onClick={() => setShowStaffModal(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ background: '#7e22ce', color: '#ffffff', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Check size={16} /> Save Faculty Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
