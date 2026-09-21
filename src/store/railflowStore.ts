import { create } from 'zustand';
import {
  ASSETS,
  CANDIDATE_WINDOWS,
  DATA_QUALITY_METRICS,
  DELAY_CASCADE_DEMO,
  INITIAL_DECISION_HISTORY,
  INITIAL_NOTIFICATIONS,
  MAINTENANCE_TASKS,
  RESOURCES,
  SECTIONS,
  STATIONS,
  TRAINS,
} from '../data/mockData';
import {
  DEFAULT_OPTIMIZATION_WEIGHTS,
  OptimizationWeights,
  simulateWhatIfScenario,
  WhatIfParameters,
  WhatIfSimulationResult,
} from '../services/optimizationService';
import {
  Asset,
  CandidateWindow,
  DataQualityReport,
  DecisionLog,
  DelayCascadeNode,
  MaintenanceTask,
  NotificationItem,
  Resource,
  Section,
  Station,
  Train,
} from '../types';

export type ActiveView =
  | 'operations'
  | 'maintenance'
  | 'planner'
  | 'coordination'
  | 'scenarios'
  | 'emergency'
  | 'weekly-monthly'
  | 'hero-before-after'
  | 'analytics'
  | 'data-quality'
  | 'configuration';

export interface OptimizationStage {
  label: string;
  description: string;
}

export const OPTIMIZATION_STAGES: OptimizationStage[] = [
  { label: 'Loading maintenance requirements', description: 'Querying SMMS/TMS task backlog for section S-BHC-JJKR...' },
  { label: 'Loading scheduled train timetables', description: 'Integrating 126 daily scheduled passenger and express train paths...' },
  { label: 'Validating corridor topology & crossover interlocks', description: 'Checking 43.5km double-line track & siding infrastructure...' },
  { label: 'Checking crew & heavy machinery availability', description: 'Verifying CSM-09 Tamping Machine, TW-04 Tower Wagon & gangs...' },
  { label: 'Detecting multi-department compatibility', description: 'Aligning Civil (Tamping), S&T (Point 104A) and TRD (OHE Catenary)...' },
  { label: 'Generating candidate temporal windows', description: 'Scanning 24-hour horizon for continuous >= 2.5h windows...' },
  { label: 'Simulating train impact & headways', description: 'Evaluating express crossings, passenger connections, and regulations...' },
  { label: 'Detecting conflict intersections', description: 'Identifying priority train intercepts & single-line bottleneck risks...' },
  { label: 'Checking hard safety & operating constraints', description: 'Enforcing zero-breach priority express protection threshold...' },
  { label: 'Running CP-SAT multi-objective optimization', description: 'Minimizing train delay cascade + maximizing task consolidation...' },
  { label: 'Synthesizing explainable AI recommendation', description: 'Generating structured operational reasoning & confidence audit...' },
];

interface RailFlowState {
  // Navigation & View
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Selected Entities
  selectedSectionId: string;
  setSelectedSectionId: (id: string) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedCandidateId: string;
  setSelectedCandidateId: (id: string) => void;

  // Core Data
  stations: Station[];
  sections: Section[];
  assets: Asset[];
  tasks: MaintenanceTask[];
  trains: Train[];
  resources: Resource[];
  candidateWindows: CandidateWindow[];
  delayCascade: DelayCascadeNode;
  decisionHistory: DecisionLog[];
  dataQuality: DataQualityReport;
  notifications: NotificationItem[];
  unreadNotifsCount: number;

  // Optimization Simulation State
  isOptimizing: boolean;
  optimizationStage: number;
  optimizationCompleted: boolean;
  startOptimization: () => void;
  resetOptimization: () => void;

  // Human Approval Workflow
  approvalModalOpen: boolean;
  setApprovalModalOpen: (open: boolean) => void;
  candidateToApprove: CandidateWindow | null;
  setCandidateToApprove: (candidate: CandidateWindow | null) => void;
  approveCandidateWindow: (candidate: CandidateWindow, notes?: string) => void;

  // What-If Simulator
  whatIfParams: WhatIfParameters;
  setWhatIfParams: (params: Partial<WhatIfParameters>) => void;
  whatIfResult: WhatIfSimulationResult;

  // Emergency Replanning State
  emergencyModalOpen: boolean;
  setEmergencyModalOpen: (open: boolean) => void;
  isEmergencyReplanned: boolean;
  triggerEmergencyReplan: () => void;

  // Policy & Optimization Weights
  optimizationWeights: OptimizationWeights;
  setOptimizationWeights: (weights: Partial<OptimizationWeights>) => void;

  // Guided Demo Mode (90s SIH Showcase)
  isDemoMode: boolean;
  demoStep: number;
  demoAutoPlay: boolean;
  startDemoMode: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  setDemoStep: (step: number) => void;
  stopDemoMode: () => void;
  toggleDemoAutoPlay: () => void;

  // UI helpers
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

export const useRailFlowStore = create<RailFlowState>((set, get) => {
  const initialBaseline = CANDIDATE_WINDOWS.find((c) => c.id === 'OPTION_B') || CANDIDATE_WINDOWS[0];
  const initialWhatIfParams: WhatIfParameters = {
    blockStartTime: '11:30',
    blockDurationHours: 2.5,
    trafficMultiplier: 1.0,
    protectPriorityTrains: true,
    activeDepartments: { engineering: true, snt: true, trd: true },
    requireNoTSR: true,
  };

  return {
    activeView: 'operations',
    setActiveView: (view) => set({ activeView: view }),

    selectedSectionId: 'S-VM-VRI',
    setSelectedSectionId: (id) => set({ selectedSectionId: id }),
    selectedTaskId: null,
    setSelectedTaskId: (id) => set({ selectedTaskId: id }),
    selectedCandidateId: 'OPTION_B',
    setSelectedCandidateId: (id) => set({ selectedCandidateId: id }),

    stations: STATIONS,
    sections: SECTIONS,
    assets: ASSETS,
    tasks: MAINTENANCE_TASKS,
    trains: TRAINS,
    resources: RESOURCES,
    candidateWindows: CANDIDATE_WINDOWS,
    delayCascade: DELAY_CASCADE_DEMO,
    decisionHistory: INITIAL_DECISION_HISTORY,
    dataQuality: DATA_QUALITY_METRICS,
    notifications: INITIAL_NOTIFICATIONS,
    unreadNotifsCount: INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,

    isOptimizing: false,
    optimizationStage: 0,
    optimizationCompleted: true,

    startOptimization: () => {
      set({ isOptimizing: true, optimizationStage: 0, optimizationCompleted: false });
      let currentStage = 0;
      const interval = setInterval(() => {
        currentStage += 1;
        if (currentStage >= OPTIMIZATION_STAGES.length) {
          clearInterval(interval);
          set({ isOptimizing: false, optimizationStage: OPTIMIZATION_STAGES.length - 1, optimizationCompleted: true, selectedCandidateId: 'OPTION_B' });
        } else {
          set({ optimizationStage: currentStage });
        }
      }, 350);
    },

    resetOptimization: () => {
      set({ isOptimizing: false, optimizationStage: 0, optimizationCompleted: false });
    },

    approvalModalOpen: false,
    setApprovalModalOpen: (open) => set({ approvalModalOpen: open }),
    candidateToApprove: null,
    setCandidateToApprove: (candidate) => set({ candidateToApprove: candidate }),

    approveCandidateWindow: (candidate, notes) => {
      const state = get();
      const newDecision: DecisionLog = {
        id: `DEC-${Date.now().toString().slice(-8)}`,
        timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB') + ' IST',
        controllerName: 'Chief Controller / Khurda Div (S.K. Ray)',
        section: 'Villupuram–Vriddhachalam (S-VM-VRI)',
        tasks: ['MT-ENG-041 (Track Tamping)', 'MT-SNT-018 (Point Machine)', 'MT-TRD-007 (OHE Inspection)'],
        chosenWindow: `${candidate.name} (${candidate.timeSlot})`,
        windowTime: candidate.timeSlot,
        reason: notes || candidate.rationale[0] || 'Approved low-impact coordinated block window.',
        status: 'Approved',
        estimatedDelay: candidate.estimatedDelayMinutes,
        priorityTrainsAffected: candidate.priorityTrainsAffected,
        coordinatedCount: 3,
      };

      // Mark tasks as consolidated & approved
      const updatedTasks = state.tasks.map((t) => {
        if (['MT-ENG-041', 'MT-SNT-018', 'MT-TRD-007'].includes(t.id)) {
          return { ...t, status: 'Approved' as const };
        }
        return t;
      });

      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        timestamp: 'Just now',
        severity: 'success',
        title: 'Block Advisory Approved',
        message: `Window ${candidate.timeSlot} approved for 3 coordinated tasks on S-BHC-JJKR.`,
        sectionId: 'S-BHC-JJKR',
        targetView: 'hero-before-after',
        read: false,
      };

      set({
        decisionHistory: [newDecision, ...state.decisionHistory],
        tasks: updatedTasks,
        approvalModalOpen: false,
        candidateToApprove: null,
        notifications: [newNotif, ...state.notifications],
        unreadNotifsCount: state.unreadNotifsCount + 1,
      });
    },

    whatIfParams: initialWhatIfParams,
    setWhatIfParams: (newParams) => {
      const updated = { ...get().whatIfParams, ...newParams };
      const res = simulateWhatIfScenario(updated, initialBaseline);
      set({ whatIfParams: updated, whatIfResult: res });
    },
    whatIfResult: simulateWhatIfScenario(initialWhatIfParams, initialBaseline),

    emergencyModalOpen: false,
    setEmergencyModalOpen: (open) => set({ emergencyModalOpen: open }),
    isEmergencyReplanned: false,
    triggerEmergencyReplan: () => {
      set({ isEmergencyReplanned: true, emergencyModalOpen: false, activeView: 'emergency' });
    },

    optimizationWeights: DEFAULT_OPTIMIZATION_WEIGHTS,
    setOptimizationWeights: (weights) => {
      set({ optimizationWeights: { ...get().optimizationWeights, ...weights } });
    },

    isDemoMode: false,
    demoStep: 0,
    demoAutoPlay: false,

    startDemoMode: () => {
      set({ isDemoMode: true, demoStep: 0, demoAutoPlay: false, activeView: 'maintenance' });
    },
    nextDemoStep: () => {
      const nextStep = get().demoStep + 1;
      get().setDemoStep(nextStep);
    },
    prevDemoStep: () => {
      const prevStep = Math.max(0, get().demoStep - 1);
      get().setDemoStep(prevStep);
    },
    setDemoStep: (step: number) => {
      const viewsByStep: ActiveView[] = [
        'maintenance', // Step 0: 3 Requests arrive
        'maintenance', // Step 1: Same section detected
        'coordination', // Step 2: Compatibility bundling
        'operations', // Step 3: Train timetable loaded
        'planner', // Step 4: Optimization triggered
        'planner', // Step 5: Candidates generated
        'planner', // Step 6: Train impact & delay cascade
        'planner', // Step 7: CP-SAT selects Option B
        'planner', // Step 8: Explainability & reasoning
        'hero-before-after', // Step 9: Controller advisory approval
        'scenarios', // Step 10: What-If resilience
        'emergency', // Step 11: Emergency replanning
      ];

      const targetView = viewsByStep[step] || 'operations';
      set({ demoStep: step, activeView: targetView });
    },
    stopDemoMode: () => set({ isDemoMode: false, demoAutoPlay: false }),
    toggleDemoAutoPlay: () => set((s) => ({ demoAutoPlay: !s.demoAutoPlay })),

    markNotificationRead: (id) => {
      const updated = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      set({ notifications: updated, unreadNotifsCount: updated.filter((n) => !n.read).length });
    },
    markAllNotificationsRead: () => {
      const updated = get().notifications.map((n) => ({ ...n, read: true }));
      set({ notifications: updated, unreadNotifsCount: 0 });
    },
  };
});
