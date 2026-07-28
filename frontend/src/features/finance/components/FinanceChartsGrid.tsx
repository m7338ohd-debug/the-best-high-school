import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  CreditCard, 
  AlertCircle 
} from 'lucide-react';
import styles from './FinanceChartsGrid.module.css';

export const FinanceChartsGrid: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 1. Daily Collection Trend (Past 7 Days in ₹ Thousands)
  const dailyTrend = useMemo(() => [
    { day: 'Mon', amount: 145 },
    { day: 'Tue', amount: 182 },
    { day: 'Wed', amount: 160 },
    { day: 'Thu', amount: 210 },
    { day: 'Fri', amount: 195 },
    { day: 'Sat', amount: 240 },
    { day: 'Sun', amount: 142.5 },
  ], []);

  // 2. Payment Channel Distribution (Donut Chart)
  const paymentChannels = useMemo(() => [
    { label: 'UPI / QR', percent: 42, color: '#a855f7' },
    { label: 'Counter Cash', percent: 34, color: '#10b981' },
    { label: 'Card POS', percent: 12, color: '#3b82f6' },
    { label: 'Cheque', percent: 8, color: '#f59e0b' },
    { label: 'Bank Transfer', percent: 4, color: '#64748b' },
  ], []);

  // 3. Outstanding Balance by Class (Horizontal Bar Chart)
  const classBalances = useMemo(() => [
    { className: 'Grade 10', balance: 130, color: '#7e22ce' },
    { className: 'Grade 11', balance: 118, color: '#9333ea' },
    { className: 'Grade 12', balance: 95, color: '#a855f7' },
    { className: 'Grade 9', balance: 82, color: '#c084fc' },
    { className: 'Grade 8', balance: 65, color: '#3b82f6' },
    { className: 'Grade 7', balance: 40, color: '#10b981' },
  ], []);

  // 4. Revenue by Fee Category (Donut Chart)
  const feeCategories = useMemo(() => [
    { label: 'Tuition Fee', percent: 65, color: '#7e22ce' },
    { label: 'Transport Bus', percent: 18, color: '#0284c7' },
    { label: 'STEM Lab Fee', percent: 10, color: '#10b981' },
    { label: 'Annual Exam', percent: 7, color: '#f59e0b' },
  ], []);

  // SVG Helper Math
  const svgW = 550;
  const svgH = 160;
  const padX = 35;
  const padY = 20;
  const maxAmount = 280;

  const getX = (idx: number) => padX + (idx / (dailyTrend.length - 1)) * (svgW - 2 * padX);
  const getY = (val: number) => svgH - padY - (val / maxAmount) * (svgH - 2 * padY);

  const linePath = dailyTrend.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.amount)}`).join(' ');
  const areaPath = `${linePath} L ${getX(dailyTrend.length - 1)} ${svgH - padY} L ${getX(0)} ${svgH - padY} Z`;

  const renderDonut = (items: { label: string; percent: number; color: string }[], radius = 55, strokeW = 18) => {
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return items.map((item, idx) => {
      const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -offset;
      offset += (item.percent / 100) * circumference;

      return (
        <circle
          key={idx}
          cx="90"
          cy="90"
          r={radius}
          fill="transparent"
          stroke={item.color}
          strokeWidth={strokeW}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={styles.donutArc}
        />
      );
    });
  };

  return (
    <div className={styles.container}>
      {/* CHART 1: Daily Fee Collection Trend (Line & Area Chart) */}
      <div className={styles.chartCard} style={{ gridColumn: 'span 2' }}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badgePurple}><TrendingUp size={12} /> Daily Revenue Stream</div>
            <h3 className={styles.chartTitle}>Daily Collection Trend (₹ Thousands)</h3>
            <p className={styles.chartSub}>Real-time counter collections over the past 7 days</p>
          </div>
        </div>

        <div className={styles.svgWrapper}>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} className={styles.svgChart}>
            <defs>
              <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75].map((ratio, i) => (
              <line key={i} x1={padX} y1={padY + ratio * (svgH - 2 * padY)} x2={svgW - padX} y2={padY + ratio * (svgH - 2 * padY)} stroke="#e2e8f0" strokeDasharray="3 3" />
            ))}

            <path d={areaPath} fill="url(#dailyGrad)" />
            <path d={linePath} fill="none" stroke="#7e22ce" strokeWidth="3" strokeLinecap="round" />

            {dailyTrend.map((d, i) => (
              <g key={i}>
                <circle cx={getX(i)} cy={getY(d.amount)} r="5" fill="#ffffff" stroke="#7e22ce" strokeWidth="3" />
                <rect
                  x={getX(i) - 15}
                  y={0}
                  width={30}
                  height={svgH}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            ))}
          </svg>

          {hoveredIndex !== null && (
            <div className={styles.tooltipBox} style={{ left: `${(getX(hoveredIndex) / svgW) * 100}%` }}>
              <strong>{dailyTrend[hoveredIndex].day}</strong>
              <div>Collection: <strong>₹{dailyTrend[hoveredIndex].amount}K</strong></div>
            </div>
          )}

          <div className={styles.xLabels}>
            {dailyTrend.map((d, i) => (
              <span key={i} style={{ left: `${(getX(i) / svgW) * 100}%` }}>{d.day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CHART 2: Payment Mode Channel Breakdown (Donut Chart) */}
      <div className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badgeBlue}><CreditCard size={12} /> Payment Channels</div>
            <h3 className={styles.chartTitle}>Payment Channel Share</h3>
            <p className={styles.chartSub}>UPI vs Cash vs Card vs Bank</p>
          </div>
        </div>

        <div className={styles.donutContainer}>
          <svg viewBox="0 0 180 180" className={styles.donutSvg}>
            {renderDonut(paymentChannels, 55, 18)}
          </svg>
          <div className={styles.donutCenter}>
            <span className={styles.donutVal}>42%</span>
            <span className={styles.donutSub}>UPI / QR</span>
          </div>
        </div>

        <div className={styles.statusLegendGrid}>
          {paymentChannels.map((item, idx) => (
            <div key={idx} className={styles.statusRow}>
              <div className={styles.statusLabel}>
                <span className={styles.colorDot} style={{ background: item.color }} />
                <span>{item.label}</span>
              </div>
              <strong className={styles.statusCount}>{item.percent}%</strong>
            </div>
          ))}
        </div>
      </div>

      {/* CHART 3: Outstanding Balance by Class (Horizontal Bar Chart) */}
      <div className={styles.chartCard} style={{ gridColumn: 'span 2' }}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badgeRed}><AlertCircle size={12} /> Dues by Grade</div>
            <h3 className={styles.chartTitle}>Outstanding Dues by Class (₹ Thousands)</h3>
            <p className={styles.chartSub}>Overdue balances requiring accountant reminder</p>
          </div>
        </div>

        <div className={styles.barList}>
          {classBalances.map((item, idx) => {
            const maxBal = 150;
            const barWidth = (item.balance / maxBal) * 100;

            return (
              <div key={idx} className={styles.barRow}>
                <span className={styles.classNameLabel}>{item.className}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${barWidth}%`, backgroundColor: item.color }} />
                </div>
                <strong className={styles.classCountVal}>₹{item.balance}K</strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHART 4: Revenue by Fee Category (Donut Chart) */}
      <div className={styles.chartCard}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.badgePurple}><PieIcon size={12} /> Fee Categories</div>
            <h3 className={styles.chartTitle}>Fee Category Distribution</h3>
            <p className={styles.chartSub}>Tuition, Bus, Lab & Exam Fees</p>
          </div>
        </div>

        <div className={styles.donutContainer}>
          <svg viewBox="0 0 180 180" className={styles.donutSvg}>
            {renderDonut(feeCategories, 55, 18)}
          </svg>
          <div className={styles.donutCenter}>
            <span className={styles.donutVal}>65%</span>
            <span className={styles.donutSub}>Tuition</span>
          </div>
        </div>

        <div className={styles.statusLegendGrid}>
          {feeCategories.map((item, idx) => (
            <div key={idx} className={styles.statusRow}>
              <div className={styles.statusLabel}>
                <span className={styles.colorDot} style={{ background: item.color }} />
                <span>{item.label}</span>
              </div>
              <strong className={styles.statusCount}>{item.percent}%</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
