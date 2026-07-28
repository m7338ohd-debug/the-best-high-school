import React, { useState } from 'react';
import { 
  DollarSign, 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Sun, 
  Moon, 
  Sunset as SunsetIcon, 
  RotateCw, 
  Layers, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Activity, 
  Shield, 
  Maximize2,
  X
} from 'lucide-react';
import { useSchoolSettings } from '../../../shared/context/SchoolContext';
import styles from './IsometricSchoolCampus3D.module.css';

interface IsometricSchoolCampus3DProps {
  schoolName?: string;
  onNavigateToFinance?: () => void;
  onNavigateToStudents?: () => void;
  onNavigateToReports?: () => void;
}

type TimeOfDay = 'day' | 'sunset' | 'night';
type CameraView = 'iso' | 'top' | 'front';

export const IsometricSchoolCampus3D: React.FC<IsometricSchoolCampus3DProps> = ({
  schoolName: propSchoolName,
  onNavigateToFinance,
  onNavigateToStudents,
  onNavigateToReports,
}) => {
  const { profile } = useSchoolSettings();
  const schoolName = propSchoolName || profile.schoolName;
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [cameraView, setCameraView] = useState<CameraView>('iso');
  const [activeBuilding, setActiveBuilding] = useState<string | null>(null);
  const [rotationY, setRotationY] = useState(-45);
  const [rotationX, setRotationX] = useState(60);
  const [showLabels, setShowLabels] = useState(true);

  // Quick Action Modal state for selected isometric building
  const [modalBuilding, setModalBuilding] = useState<{
    id: string;
    title: string;
    category: string;
    stat: string;
    detail: string;
    features: string[];
    actionText: string;
    onAction?: () => void;
  } | null>(null);

  const resetView = () => {
    setRotationX(60);
    setRotationY(-45);
    setCameraView('iso');
  };

  const handleBuildingClick = (buildingId: string) => {
    setActiveBuilding(buildingId);

    switch (buildingId) {
      case 'finance':
        setModalBuilding({
          id: 'finance',
          title: 'Finance & Ledger Vault Building',
          category: 'Fee Collection & Double-Entry Accounting Hub',
          stat: '₹1,42,850.00 Collected Today',
          detail: 'Real-time financial processing tower equipped with double-entry ledgers, gapless receipt numbering, and automated SMS receipt dispatch.',
          features: [
            'Daily Fee Collection Counter (Online & Cash)',
            'Automated Term Fee Payment Gateway',
            'Double-Entry General Ledger Audit Trail',
            'Overdue Fee Auto-Reminder Engine'
          ],
          actionText: 'Open Accountant Fee Terminal →',
          onAction: onNavigateToFinance,
        });
        break;

      case 'academic':
        setModalBuilding({
          id: 'academic',
          title: 'Main Academic & Admin Building',
          category: 'Primary Learning & Faculty Headquarters',
          stat: '1,280 Enrolled • 98.4% Attendance',
          detail: 'Central administrative and classroom building managing student enrolments, faculty assignments, and daily attendance tracking.',
          features: [
            'Classroom Roster & Student Profiles',
            'Real-Time Student Attendance Monitor',
            'Faculty & Teacher Assignment Grid',
            'Parent-Teacher Interaction Logs'
          ],
          actionText: 'View Student Directory →',
          onAction: onNavigateToStudents,
        });
        break;

      case 'stem':
        setModalBuilding({
          id: 'stem',
          title: 'Science & STEM Innovation Labs',
          category: 'Robotics, AI & Advanced Research Wing',
          stat: '12 Active Smart Labs',
          detail: 'Modern laboratory facility housing Physics, Chemistry, Biology, Robotics, and Artificial Intelligence research centers.',
          features: [
            'Interactive Smart Classroom Displays',
            'Robotics & Coding Workshop Kits',
            'Lab Equipment Inventory Management',
            'Scientific Research Grant Tracker'
          ],
          actionText: 'Explore STEM Facilities →',
          onAction: onNavigateToReports,
        });
        break;

      case 'library':
        setModalBuilding({
          id: 'library',
          title: 'Central Library & Digital Knowledge Hub',
          category: 'E-Learning & Archival Resource Center',
          stat: '45,000+ Books & Digital Journals',
          detail: 'High-speed digital library network providing e-books, research publications, and quiet study auditoriums for students.',
          features: [
            'RFID Book Tracking & Automated Issue System',
            'Digital E-Book Access Portal',
            'Quiet Study Room Reservation',
            'Academic Research Database Search'
          ],
          actionText: 'View Library Index →',
          onAction: onNavigateToReports,
        });
        break;

      case 'sports':
        setModalBuilding({
          id: 'sports',
          title: 'Sports Complex & Gymnasium Arena',
          category: 'Athletics, Indoor Courts & Swimming Pool',
          stat: '8 Indoor & Outdoor Sports Programs',
          detail: 'Multi-sport athletic complex supporting basketball, football track, swimming, gymnastics, and inter-school tournaments.',
          features: [
            'Olympic-Sized Swimming Pool & Gym',
            'Inter-School Tournament Scheduler',
            'Sports Gear & Equipment Locker',
            'Student Fitness & Health Tracker'
          ],
          actionText: 'Check Sports Schedule →',
          onAction: onNavigateToReports,
        });
        break;

      default:
        break;
    }
  };

  return (
    <div className={`${styles.container} ${styles[timeOfDay]}`}>
      {/* Visual Top Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.badge}>
            <Sparkles size={14} /> 3D Isometric ERP Campus Model
          </div>
          <h2 className={styles.title}>{schoolName} Interactive Campus Workspace</h2>
          <p className={styles.subtitle}>Click any 3D isometric building to open instant ERP operations, fee collections, and student management controls</p>
        </div>

        {/* Toolbar Controls */}
        <div className={styles.controls}>
          {/* Time of Day Toggle */}
          <div className={styles.controlGroup}>
            <button
              className={`${styles.iconBtn} ${timeOfDay === 'day' ? styles.activeControl : ''}`}
              onClick={() => setTimeOfDay('day')}
              title="Daylight Sunshine"
            >
              <Sun size={16} />
              <span>Day</span>
            </button>
            <button
              className={`${styles.iconBtn} ${timeOfDay === 'sunset' ? styles.activeControl : ''}`}
              onClick={() => setTimeOfDay('sunset')}
              title="Sunset Gold"
            >
              <SunsetIcon size={16} />
              <span>Sunset</span>
            </button>
            <button
              className={`${styles.iconBtn} ${timeOfDay === 'night' ? styles.activeControl : ''}`}
              onClick={() => setTimeOfDay('night')}
              title="Cyber Neon Night"
            >
              <Moon size={16} />
              <span>Night</span>
            </button>
          </div>

          {/* Camera View Mode */}
          <div className={styles.controlGroup}>
            <button
              className={`${styles.iconBtn} ${cameraView === 'iso' ? styles.activeControl : ''}`}
              onClick={() => { setCameraView('iso'); setRotationX(60); setRotationY(-45); }}
            >
              <Layers size={16} />
              <span>3D Iso</span>
            </button>
            <button
              className={`${styles.iconBtn} ${cameraView === 'top' ? styles.activeControl : ''}`}
              onClick={() => { setCameraView('top'); setRotationX(0); setRotationY(0); }}
            >
              <Maximize2 size={16} />
              <span>Top-Down</span>
            </button>
          </div>

          <button
            className={`${styles.iconBtn} ${showLabels ? styles.activeControl : ''}`}
            onClick={() => setShowLabels(!showLabels)}
            title="Toggle Labels"
          >
            <Activity size={16} />
            <span>Hotspots</span>
          </button>

          <button className={styles.resetBtn} onClick={resetView} title="Reset View">
            <RotateCw size={16} />
          </button>
        </div>
      </div>

      {/* 3D Isometric Canvas Viewport */}
      <div className={styles.viewport}>
        {/* Background Atmosphere Lights */}
        <div className={styles.lightBeam1} />
        <div className={styles.lightBeam2} />

        {/* Floating Clouds */}
        <div className={styles.clouds}>
          <div className={`${styles.cloud} ${styles.cloud1}`} />
          <div className={`${styles.cloud} ${styles.cloud2}`} />
          <div className={`${styles.cloud} ${styles.cloud3}`} />
        </div>

        {/* 3D Stage Container */}
        <div
          className={styles.stage}
          style={{
            transform: cameraView === 'top' 
              ? 'rotateX(0deg) rotateZ(0deg) scale(0.85)' 
              : `rotateX(${rotationX}deg) rotateZ(${rotationY}deg) scale(0.9)`,
          }}
        >
          {/* Ground Base Plate & Isometric Grid */}
          <div className={styles.groundBase}>
            <div className={styles.gridOverlay} />
            
            {/* Campus Roads & Pathways */}
            <div className={styles.roadMainHorizontal} />
            <div className={styles.roadMainVertical} />
            <div className={styles.fountainPlaza}>
              <div className={styles.fountainWater}>
                <div className={styles.waterRipple} />
              </div>
            </div>

            {/* Trees & Greenery */}
            <div className={`${styles.tree} ${styles.t1}`}><div className={styles.treeCanopy} /></div>
            <div className={`${styles.tree} ${styles.t2}`}><div className={styles.treeCanopy} /></div>
            <div className={`${styles.tree} ${styles.t3}`}><div className={styles.treeCanopy} /></div>
            <div className={`${styles.tree} ${styles.t4}`}><div className={styles.treeCanopy} /></div>
            <div className={`${styles.tree} ${styles.t5}`}><div className={styles.treeCanopy} /></div>
            <div className={`${styles.tree} ${styles.t6}`}><div className={styles.treeCanopy} /></div>

            {/* Main Entrance Gate */}
            <div className={styles.entranceGate}>
              <span className={styles.gateLabel}>MAIN ENTRANCE • {schoolName.toUpperCase()}</span>
            </div>

            {/* ISOMETRIC BUILDING 1: FINANCE & LEDGER VAULT TOWER */}
            <div
              className={`${styles.building3D} ${styles.bFinance} ${activeBuilding === 'finance' ? styles.buildingActive : ''}`}
              onClick={() => handleBuildingClick('finance')}
            >
              <div className={styles.cube}>
                <div className={`${styles.face} ${styles.front}`}>
                  <div className={styles.windowGrid}>
                    <div className={styles.win} /><div className={styles.win} /><div className={styles.win} />
                    <div className={styles.win} /><div className={styles.win} /><div className={styles.win} />
                  </div>
                  <div className={styles.ledDisplay}>$142.8K TODAY</div>
                </div>
                <div className={`${styles.face} ${styles.back}`} />
                <div className={`${styles.face} ${styles.right}`}>
                  <div className={styles.windowGrid}>
                    <div className={styles.win} /><div className={styles.win} /><div className={styles.win} />
                    <div className={styles.win} /><div className={styles.win} /><div className={styles.win} />
                  </div>
                </div>
                <div className={`${styles.face} ${styles.left}`} />
                <div className={`${styles.face} ${styles.top}`}>
                  <div className={styles.roofHelipad}>
                    <DollarSign size={20} className={styles.goldDollar} />
                  </div>
                </div>
              </div>
              <div className={styles.shadow} />

              {/* Hotspot Pin */}
              {showLabels && (
                <div className={`${styles.hotspot} ${styles.hFinance}`}>
                  <div className={styles.hotspotPing} />
                  <div className={styles.hotspotCard}>
                    <div className={styles.hIconGold}><DollarSign size={14} /></div>
                    <div>
                      <strong>Finance Vault</strong>
                      <span>$142,850 Collected</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ISOMETRIC BUILDING 2: MAIN ACADEMIC & ADMIN BLOCK */}
            <div
              className={`${styles.building3D} ${styles.bAcademic} ${activeBuilding === 'academic' ? styles.buildingActive : ''}`}
              onClick={() => handleBuildingClick('academic')}
            >
              <div className={styles.cube}>
                <div className={`${styles.face} ${styles.front}`}>
                  <div className={styles.archWay}>
                    <div className={styles.archDoor} />
                  </div>
                  <div className={styles.windowGridLarge}>
                    <div className={styles.win} /><div className={styles.win} /><div className={styles.win} /><div className={styles.win} />
                    <div className={styles.win} /><div className={styles.win} /><div className={styles.win} /><div className={styles.win} />
                  </div>
                </div>
                <div className={`${styles.face} ${styles.back}`} />
                <div className={`${styles.face} ${styles.right}`}>
                  <div className={styles.windowGridLarge}>
                    <div className={styles.win} /><div className={styles.win} /><div className={styles.win} /><div className={styles.win} />
                    <div className={styles.win} /><div className={styles.win} /><div className={styles.win} /><div className={styles.win} />
                  </div>
                </div>
                <div className={`${styles.face} ${styles.left}`} />
                <div className={`${styles.face} ${styles.top}`}>
                  <div className={styles.roofSolar}>
                    <GraduationCap size={22} className={styles.roofIcon} />
                    <span className={styles.solarLabel}>ACADEMIC HQ</span>
                  </div>
                </div>
              </div>
              <div className={styles.shadow} />

              {/* Hotspot Pin */}
              {showLabels && (
                <div className={`${styles.hotspot} ${styles.hAcademic}`}>
                  <div className={styles.hotspotPing} />
                  <div className={styles.hotspotCard}>
                    <div className={styles.hIconPurple}><GraduationCap size={14} /></div>
                    <div>
                      <strong>Academic Block</strong>
                      <span>1,280 Active Students</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ISOMETRIC BUILDING 3: STEM & AI INNOVATION LAB */}
            <div
              className={`${styles.building3D} ${styles.bStem} ${activeBuilding === 'stem' ? styles.buildingActive : ''}`}
              onClick={() => handleBuildingClick('stem')}
            >
              <div className={styles.cube}>
                <div className={`${styles.face} ${styles.front}`}>
                  <div className={styles.cyanGlowLine} />
                  <div className={styles.windowGrid}>
                    <div className={`${styles.win} ${styles.cyanWin}`} /><div className={`${styles.win} ${styles.cyanWin}`} />
                    <div className={`${styles.win} ${styles.cyanWin}`} /><div className={`${styles.win} ${styles.cyanWin}`} />
                  </div>
                </div>
                <div className={`${styles.face} ${styles.back}`} />
                <div className={`${styles.face} ${styles.right}`}>
                  <div className={styles.windowGrid}>
                    <div className={`${styles.win} ${styles.cyanWin}`} /><div className={`${styles.win} ${styles.cyanWin}`} />
                    <div className={`${styles.win} ${styles.cyanWin}`} /><div className={`${styles.win} ${styles.cyanWin}`} />
                  </div>
                </div>
                <div className={`${styles.face} ${styles.left}`} />
                <div className={`${styles.face} ${styles.top}`}>
                  <div className={styles.stemDome}>
                    <div className={styles.antenna} />
                  </div>
                </div>
              </div>
              <div className={styles.shadow} />

              {showLabels && (
                <div className={`${styles.hotspot} ${styles.hStem}`}>
                  <div className={styles.hotspotPing} />
                  <div className={styles.hotspotCard}>
                    <div className={styles.hIconCyan}><Sparkles size={14} /></div>
                    <div>
                      <strong>STEM Labs</strong>
                      <span>12 AI & Robotics Labs</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ISOMETRIC BUILDING 4: LIBRARY & DIGITAL HUB */}
            <div
              className={`${styles.building3D} ${styles.bLibrary} ${activeBuilding === 'library' ? styles.buildingActive : ''}`}
              onClick={() => handleBuildingClick('library')}
            >
              <div className={styles.cube}>
                <div className={`${styles.face} ${styles.front}`}>
                  <div className={styles.windowGrid}>
                    <div className={styles.win} /><div className={styles.win} />
                    <div className={styles.win} /><div className={styles.win} />
                  </div>
                </div>
                <div className={`${styles.face} ${styles.back}`} />
                <div className={`${styles.face} ${styles.right}`}>
                  <div className={styles.windowGrid}>
                    <div className={styles.win} /><div className={styles.win} />
                    <div className={styles.win} /><div className={styles.win} />
                  </div>
                </div>
                <div className={`${styles.face} ${styles.left}`} />
                <div className={`${styles.face} ${styles.top}`}>
                  <div className={styles.roofGlass}>
                    <BookOpen size={18} className={styles.bookIcon} />
                  </div>
                </div>
              </div>
              <div className={styles.shadow} />

              {showLabels && (
                <div className={`${styles.hotspot} ${styles.hLibrary}`}>
                  <div className={styles.hotspotPing} />
                  <div className={styles.hotspotCard}>
                    <div className={styles.hIconBlue}><BookOpen size={14} /></div>
                    <div>
                      <strong>Digital Library</strong>
                      <span>45k E-Books Issued</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ISOMETRIC BUILDING 5: SPORTS COMPLEX & ARENA */}
            <div
              className={`${styles.building3D} ${styles.bSports} ${activeBuilding === 'sports' ? styles.buildingActive : ''}`}
              onClick={() => handleBuildingClick('sports')}
            >
              <div className={styles.cube}>
                <div className={`${styles.face} ${styles.front}`}>
                  <div className={styles.sportsStripe} />
                </div>
                <div className={`${styles.face} ${styles.back}`} />
                <div className={`${styles.face} ${styles.right}`} />
                <div className={`${styles.face} ${styles.left}`} />
                <div className={`${styles.face} ${styles.top}`}>
                  <div className={styles.stadiumDome}>
                    <Trophy size={20} className={styles.trophyIcon} />
                  </div>
                </div>
              </div>
              <div className={styles.shadow} />

              {showLabels && (
                <div className={`${styles.hotspot} ${styles.hSports}`}>
                  <div className={styles.hotspotPing} />
                  <div className={styles.hotspotCard}>
                    <div className={styles.hIconGreen}><Trophy size={14} /></div>
                    <div>
                      <strong>Sports Arena</strong>
                      <span>8 Athletics Programs</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Floating Live KPI Bar Overlay at Bottom of Campus */}
      <div className={styles.liveKpiBar}>
        <div className={styles.kpiItem} onClick={() => handleBuildingClick('finance')}>
          <div className={styles.kpiBadgeGold}><DollarSign size={16} /></div>
          <div>
            <span className={styles.kpiLabel}>Total Revenue Term</span>
            <strong className={styles.kpiVal}>$142,850.00</strong>
          </div>
          <span className={styles.kpiTagGreen}>+12.4% ARR</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.kpiItem} onClick={() => handleBuildingClick('academic')}>
          <div className={styles.kpiBadgePurple}><GraduationCap size={16} /></div>
          <div>
            <span className={styles.kpiLabel}>Active Student Quota</span>
            <strong className={styles.kpiVal}>1,280 / 2,500</strong>
          </div>
          <span className={styles.kpiTagBlue}>51.2% CAPACITY</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.kpiItem} onClick={() => handleBuildingClick('finance')}>
          <div className={styles.kpiBadgeBlue}><Shield size={16} /></div>
          <div>
            <span className={styles.kpiLabel}>Tenant DB Isolation</span>
            <strong className={styles.kpiVal}>PostgreSQL Isolated</strong>
          </div>
          <span className={styles.kpiTagGreen}>100% HEALTHY</span>
        </div>
      </div>

      {/* Building Details Quick Action Modal */}
      {modalBuilding && (
        <div className={styles.modalOverlay} onClick={() => setModalBuilding(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setModalBuilding(null)}>
              <X size={18} />
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalBadge}>{modalBuilding.category}</div>
              <h3 className={styles.modalTitle}>{modalBuilding.title}</h3>
              <div className={styles.modalStat}>{modalBuilding.stat}</div>
            </div>

            <p className={styles.modalDetail}>{modalBuilding.detail}</p>

            <div className={styles.featureGrid}>
              {modalBuilding.features.map((feat, idx) => (
                <div key={idx} className={styles.featureItem}>
                  <CheckCircle2 size={16} className={styles.featureCheck} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.primaryActionBtn}
                onClick={() => {
                  setModalBuilding(null);
                  if (modalBuilding.onAction) modalBuilding.onAction();
                }}
              >
                <span>{modalBuilding.actionText}</span>
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
