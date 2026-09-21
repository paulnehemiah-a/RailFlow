export type Department = 'Engineering' | 'S&T' | 'Traction/OHE';

export type WorkType = 
  | 'Periodic Track Maintenance' 
  | 'Defective Point Repair' 
  | 'Preventive OHE Inspection' 
  | 'Ultrasonic Rail Flaw Detection' 
  | 'Track Tamping & Lining' 
  | 'Signal Interlocking Overhaul' 
  | 'Emergency Rail Joint Re-weld'
  | 'Cantilever Alignment';

export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type TaskStatus = 'Pending' | 'Due' | 'Overdue' | 'In-Progress' | 'Consolidated' | 'Approved' | 'Completed';

export interface MaintenanceTask {
  id: string; // e.g. MT-ENG-041
  department: Department;
  assetId: string;
  assetName: string;
  sectionId: string;
  sectionName: string;
  workType: WorkType;
  durationHours: number;
  urgency: 'Immediate' | 'High' | 'Normal';
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  failureRiskScore: number; // 0 - 100
  priorityScore: number; // 0 - 100
  dueDate: string;
  daysOverdue?: number;
  status: TaskStatus;
  requiredTeam: string;
  requiredEquipment: string[];
  compatibleTasks: string[];
  blockRequired: boolean;
  reasonForPriority: string[];
  schedulingImpact: string;
  historicalDurationHours: number;
  lastMaintenanceDate: string;
}

export interface Asset {
  id: string; // TRK-BHIC-018 or TRK-VM-018
  name: string;
  type: 'Track' | 'Signal' | 'Point & Crossing' | 'OHE' | 'Interlocking';
  department: Department;
  sectionId: string;
  sectionName: string;
  condition: 'Good' | 'Fair' | 'Poor' | 'Critical';
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  failureRisk: number; // 0-100
  lastMaintenance: string;
  lastMaintenanceDays: number;
  nextDueDays: number;
  trafficExposure: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  healthScore: number;
  telemetry: {
    vibration?: string;
    temperature?: string;
    wearLevel?: string;
    voltage?: string;
    defectCount?: number;
  };
}

export interface Station {
  id: string;
  code: string;
  name: string;
  km: number;
  coordinates: [number, number]; // lat, lng
  tracks: number;
  platforms: number;
  hasCrossover: boolean;
  division?: string;
}

export interface Section {
  id: string; // e.g. S-VM-VRI or S-BHC-JJKR
  fromStationId: string;
  toStationId: string;
  fromStationName: string;
  toStationName: string;
  name: string;
  lengthKm: number;
  trackType: 'Double Line Electrified' | 'Triple Line Electrified';
  maxSectionSpeed: number; // km/h
  currentStatus: 'Normal' | 'Maintenance Scheduled' | 'Active Block' | 'TSR Active' | 'Caution';
  activeTrainsCount: number;
  pendingTasksCount: number;
  criticalTasksCount: number;
  pathCoordinates: [number, number][];
  division?: string;
}

export interface TimetableStop {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  distanceKm: number;
  day: number;
}

export interface Train {
  number: string;
  name: string;
  type: 'Superfast / Intercity' | 'Superfast Express' | 'Mail/Express' | 'Passenger/MEMU';
  isPriority: boolean;
  fromStation: string;
  toStation: string;
  fromStationCode: string;
  toStationCode: string;
  currentSectionId: string;
  currentStationId?: string;
  status: 'On Time' | 'Delayed +5m' | 'Delayed +18m' | 'Regulated' | 'Protected';
  speedKmH: number;
  coordinates: [number, number];
  passTimes: { [stationId: string]: string };
  delayMinutes: number;
  serviceType: 'Daily' | 'Tri-Weekly' | 'Bi-Weekly';
  classes: string[];
  operationalImportance: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  timetableStops?: TimetableStop[];
  isVaigaiExpress?: boolean;
}

export interface DelayCascadeNode {
  trainNumber: string;
  trainName: string;
  isPriority: boolean;
  primaryDelayMin: number;
  cascadeDelayMin: number;
  totalDelayMin: number;
  cause: string;
  affectedSection: string;
  downstreamTrains?: DelayCascadeNode[];
}

export interface CandidateWindow {
  id: 'OPTION_A' | 'OPTION_B' | 'OPTION_C' | 'EMERGENCY_REPLAN' | 'CUSTOM';
  name: string;
  timeSlot: string; // "11:30 – 14:00 IST"
  startTime: string; // "11:30"
  endTime: string; // "14:00"
  durationHours: number;
  isFeasible: boolean;
  isRecommended: boolean;
  impactScore: number; // lower is better
  trainsAffected: number;
  estimatedDelayMinutes: number;
  priorityTrainsAffected: number;
  conflictCount: number;
  speedRestrictionRequired: boolean;
  resourceFeasible: boolean;
  maintenanceFeasible: boolean;
  overallImpactLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGH COMPLEXITY' | 'INFEASIBLE';
  rationale: string[];
  rejectedReasons?: string[];
  hardConstraints: { name: string; satisfied: boolean; note?: string }[];
  softObjectives: { name: string; score: number; maxScore: number; note: string }[];
  affectedTrainList: { number: string; name: string; isPriority: boolean; estimatedDelay: number; scheduledTime: string }[];
  vaigaiImpactStatus?: 'PROTECTED' | 'CONFLICT' | 'UNAFFECTED';
}

export interface Resource {
  id: string;
  name: string;
  department: Department;
  type: 'Civil Gang' | 'Signal Gang' | 'TRD Gang' | 'Tamping Machine' | 'Tower Wagon' | 'Signal Test Kit';
  status: 'AVAILABLE' | 'BUSY' | 'MAINTENANCE' | 'ASSIGNED';
  assignedSection?: string;
  currentLocation: string;
  contactLead: string;
}

export interface DecisionLog {
  id: string;
  timestamp: string;
  controllerName: string;
  section: string;
  tasks: string[];
  chosenWindow: string;
  windowTime: string;
  reason: string;
  status: 'Approved' | 'Modified' | 'Rejected' | 'Emergency Enacted';
  estimatedDelay: number;
  priorityTrainsAffected: number;
  coordinatedCount: number;
  vaigaiProtected?: boolean;
}

export interface DataQualityReport {
  overallScore: number;
  timetableCompleteness: number;
  maintenanceRecords: number;
  assetHealthTelemetry: number;
  resourceAvailability: number;
  corridorTopology: number;
  warnings: {
    id: string;
    severity: 'critical' | 'warning' | 'info';
    source: string;
    message: string;
    impact: string;
    recommendationConfidencePenalty: number;
  }[];
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  sectionId?: string;
  targetView?: string;
  read: boolean;
}
