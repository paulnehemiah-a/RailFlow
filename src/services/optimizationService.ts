import { CandidateWindow } from '../types';

export interface OptimizationWeights {
  trainDelayWeight: number; // 0 - 100
  priorityProtectionWeight: number; // 0 - 100
  taskConsolidationWeight: number; // 0 - 100
  resourceUtilizationWeight: number; // 0 - 100
  assetDowntimeWeight: number; // 0 - 100
}

export const DEFAULT_OPTIMIZATION_WEIGHTS: OptimizationWeights = {
  trainDelayWeight: 80,
  priorityProtectionWeight: 95,
  taskConsolidationWeight: 85,
  resourceUtilizationWeight: 60,
  assetDowntimeWeight: 50,
};

export interface WhatIfParameters {
  blockStartTime: string; // e.g. "11:30"
  blockDurationHours: number; // e.g. 2.5
  trafficMultiplier: number; // e.g. 1.0 (normal), 1.3 (peak), 0.7 (low)
  protectPriorityTrains: boolean;
  activeDepartments: {
    engineering: boolean;
    snt: boolean;
    trd: boolean;
  };
  requireNoTSR: boolean;
}

export interface WhatIfSimulationResult {
  candidateWindow: CandidateWindow;
  deltaDelayMinutes: number;
  deltaPriorityConflicts: number;
  deltaImpactScore: number;
  statusComparison: 'BETTER' | 'EQUAL' | 'WORSE';
  aiVerdict: string;
}

/**
 * Calculates dynamic impact score and train delays based on user What-If parameters
 */
export function simulateWhatIfScenario(
  params: WhatIfParameters,
  baselineCandidate: CandidateWindow
): WhatIfSimulationResult {
  const [startHour, startMin] = params.blockStartTime.split(':').map(Number);
  const startDecimal = startHour + startMin / 60;
  const endDecimal = startDecimal + params.blockDurationHours;

  const endHour = Math.floor(endDecimal) % 24;
  const endMinute = Math.round((endDecimal % 1) * 60);
  const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

  // Time window characteristics on Bhadrak-Jajpur section
  let baseDelay = 18;
  let priorityConflicts = 0;
  let trainsAffected = 3;
  let isTSRNeeded = false;

  // Peak morning window (07:00 - 10:30): High traffic, 12801 Purushottam
  if (startDecimal >= 7.0 && startDecimal < 10.5) {
    baseDelay = Math.round(55 * params.trafficMultiplier);
    priorityConflicts = params.protectPriorityTrains ? 2 : 1;
    trainsAffected = 5;
  }
  // Optimal midday window (11:00 - 14:00): Low density
  else if (startDecimal >= 11.0 && startDecimal <= 13.5) {
    baseDelay = Math.round(18 * params.trafficMultiplier);
    priorityConflicts = 0;
    trainsAffected = Math.round(3 * params.trafficMultiplier);
  }
  // Afternoon window (14:00 - 17:30): Coromandel Express, passenger services
  else if (startDecimal > 13.5 && startDecimal < 17.5) {
    baseDelay = Math.round(38 * params.trafficMultiplier);
    priorityConflicts = 1;
    trainsAffected = 4;
    isTSRNeeded = true;
  }
  // Evening window (18:00 - 22:00): Heavy commuter & express traffic
  else if (startDecimal >= 18.0 && startDecimal <= 22.0) {
    baseDelay = Math.round(72 * params.trafficMultiplier);
    priorityConflicts = 2;
    trainsAffected = 6;
    isTSRNeeded = true;
  }
  // Night window (00:30 - 04:30): Lowest scheduled passenger traffic
  else {
    baseDelay = Math.round(8 * params.trafficMultiplier);
    priorityConflicts = 0;
    trainsAffected = 1;
  }

  // Duration penalty (each 0.5h beyond 2h adds exponential congestion)
  if (params.blockDurationHours > 2.5) {
    baseDelay += Math.round((params.blockDurationHours - 2.5) * 16);
  }

  const impactScore = Math.min(
    100,
    Math.round(baseDelay * 0.7 + priorityConflicts * 30 + (isTSRNeeded ? 15 : 0))
  );

  const simulatedWindow: CandidateWindow = {
    id: 'CUSTOM',
    name: `Custom Scenario (${params.blockStartTime} – ${endTimeStr})`,
    timeSlot: `${params.blockStartTime} – ${endTimeStr} IST`,
    startTime: params.blockStartTime,
    endTime: endTimeStr,
    durationHours: params.blockDurationHours,
    isFeasible: priorityConflicts === 0 || !params.protectPriorityTrains,
    isRecommended: impactScore < baselineCandidate.impactScore,
    impactScore,
    trainsAffected,
    estimatedDelayMinutes: baseDelay,
    priorityTrainsAffected: priorityConflicts,
    conflictCount: priorityConflicts + (trainsAffected > 3 ? 1 : 0),
    speedRestrictionRequired: isTSRNeeded && !params.requireNoTSR,
    resourceFeasible: true,
    maintenanceFeasible: true,
    overallImpactLevel: impactScore < 30 ? 'LOW' : impactScore < 60 ? 'MEDIUM' : 'HIGH',
    rationale: [
      `Simulated ${params.blockDurationHours}h window starting at ${params.blockStartTime} IST.`,
      `Traffic multiplier set to ${params.trafficMultiplier}x normal volume.`,
      priorityConflicts > 0
        ? `Causes ${priorityConflicts} priority train intersection(s).`
        : 'Zero priority express conflicts detected.',
    ],
    hardConstraints: [
      { name: 'Priority Train Protection Threshold', satisfied: priorityConflicts === 0 },
      { name: 'Minimum Duration Fit', satisfied: params.blockDurationHours >= 2.0 },
      { name: 'Resource Availability', satisfied: true },
    ],
    softObjectives: [
      { name: 'Train Delay Minimization', score: Math.max(0, 100 - baseDelay), maxScore: 100, note: `${baseDelay}m total delay` },
      { name: 'TSR Avoidance', score: isTSRNeeded ? 30 : 100, maxScore: 100, note: isTSRNeeded ? 'TSR required' : 'Clean clear' },
    ],
    affectedTrainList: [
      ...(priorityConflicts > 0
        ? [{ number: '12801', name: 'Purushottam SF Exp', isPriority: true, estimatedDelay: 22, scheduledTime: 'Approach' }]
        : []),
      { number: '58412', name: 'Bhadrak-Cuttack Pass', isPriority: false, estimatedDelay: Math.round(baseDelay * 0.4), scheduledTime: 'Loop' },
      { number: '18410', name: 'Sri Jagannath Express', isPriority: false, estimatedDelay: Math.round(baseDelay * 0.6), scheduledTime: 'Platform' },
    ],
  };

  const deltaDelay = baseDelay - baselineCandidate.estimatedDelayMinutes;
  const deltaPriority = priorityConflicts - baselineCandidate.priorityTrainsAffected;
  const deltaScore = impactScore - baselineCandidate.impactScore;

  let statusComparison: 'BETTER' | 'EQUAL' | 'WORSE' = 'EQUAL';
  if (deltaScore < -5) statusComparison = 'BETTER';
  else if (deltaScore > 5) statusComparison = 'WORSE';

  let aiVerdict = '';
  if (statusComparison === 'WORSE') {
    aiVerdict = `Baseline Option B (11:30–14:00) remains preferable: Custom scenario incurs +${deltaDelay}m more train delay and higher network perturbation.`;
  } else if (statusComparison === 'BETTER') {
    aiVerdict = `Custom scenario yields lower impact (-${Math.abs(deltaDelay)}m delay reduction), subject to night-shift crew availability.`;
  } else {
    aiVerdict = `Custom scenario provides comparable operational performance to baseline.`;
  }

  return {
    candidateWindow: simulatedWindow,
    deltaDelayMinutes: deltaDelay,
    deltaPriorityConflicts: deltaPriority,
    deltaImpactScore: deltaScore,
    statusComparison,
    aiVerdict,
  };
}

/**
 * Calculates Emergency Replanning Window for unexpected critical track fracture / OHE drop
 */
export function generateEmergencyReplanWindow(sectionId: string): CandidateWindow {
  return {
    id: 'EMERGENCY_REPLAN',
    name: 'Emergency Re-Plan Window (10:00 – 11:30 IST)',
    timeSlot: '10:00 – 11:30 IST (Immediate 90-Min Protection)',
    startTime: '10:00',
    endTime: '11:30',
    durationHours: 1.5,
    isFeasible: true,
    isRecommended: true,
    impactScore: 38,
    trainsAffected: 4,
    estimatedDelayMinutes: 27,
    priorityTrainsAffected: 1, // Regulates 12801 by 12m for emergency safety
    conflictCount: 1,
    speedRestrictionRequired: true,
    resourceFeasible: true,
    maintenanceFeasible: true,
    overallImpactLevel: 'MEDIUM',
    rationale: [
      'IMMEDIATE EMERGENCY SAFETY DISPATCH: Urgent rail fracture repair.',
      'Shifts standard planned block earlier (from 11:30 to 10:00 IST) to avert safety hazard.',
      'Slows 12801 Purushottam Superfast by only 12m via loop diversion instead of catastrophic emergency halt.',
      'Civil Gang 01 emergency mobile unit dispatched with thermite weld kit.',
    ],
    hardConstraints: [
      { name: 'Immediate Safety Clearance (< 30 min response)', satisfied: true },
      { name: 'Emergency Thermite Kit On-Site', satisfied: true },
      { name: 'Controlled Divergence Signalling', satisfied: true },
    ],
    softObjectives: [
      { name: 'Minimize Priority Train Disruption', score: 75, maxScore: 100, note: '12m controlled delay to express' },
      { name: 'Avert Uncontrolled Line Stoppage', score: 100, maxScore: 100, note: 'Safety guaranteed' },
    ],
    affectedTrainList: [
      { number: '12801', name: 'Purushottam SF Express', isPriority: true, estimatedDelay: 12, scheduledTime: '10:15 (Regulated at Bhadrak)' },
      { number: '58412', name: 'Bhadrak-Cuttack Passenger', isPriority: false, estimatedDelay: 15, scheduledTime: '10:45 (Rescheduled)' },
    ],
  };
}
