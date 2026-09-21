import {
  ASSETS,
  CANDIDATE_WINDOWS,
  DATA_QUALITY_METRICS,
  DELAY_CASCADE_DEMO,
  INITIAL_DECISION_HISTORY,
  MAINTENANCE_TASKS,
  RESOURCES,
  SECTIONS,
  STATIONS,
  TRAINS,
} from '../data/mockData';
import {
  Asset,
  CandidateWindow,
  DataQualityReport,
  DecisionLog,
  DelayCascadeNode,
  MaintenanceTask,
  Resource,
  Section,
  Station,
  Train,
} from '../types';

/**
 * RailFlow API Service Layer
 * Abstracts backend communication. Connects to FastAPI / OR-Tools CP-SAT backend in production,
 * and provides structured, consistent mock responses in the client prototype.
 */
export const RailFlowAPI = {
  getStations: async (): Promise<Station[]> => {
    return Promise.resolve([...STATIONS]);
  },

  getSections: async (): Promise<Section[]> => {
    return Promise.resolve([...SECTIONS]);
  },

  getSectionById: async (sectionId: string): Promise<Section | undefined> => {
    return Promise.resolve(SECTIONS.find((s) => s.id === sectionId));
  },

  getAssets: async (): Promise<Asset[]> => {
    return Promise.resolve([...ASSETS]);
  },

  getMaintenanceTasks: async (): Promise<MaintenanceTask[]> => {
    return Promise.resolve([...MAINTENANCE_TASKS]);
  },

  getTrains: async (): Promise<Train[]> => {
    return Promise.resolve([...TRAINS]);
  },

  getCandidateWindows: async (sectionId: string): Promise<CandidateWindow[]> => {
    // In production: calls POST /api/blocks/optimize with sectionId and active tasks
    return Promise.resolve([...CANDIDATE_WINDOWS]);
  },

  getDelayCascade: async (candidateId: string): Promise<DelayCascadeNode> => {
    return Promise.resolve({ ...DELAY_CASCADE_DEMO });
  },

  getResources: async (): Promise<Resource[]> => {
    return Promise.resolve([...RESOURCES]);
  },

  getDecisionHistory: async (): Promise<DecisionLog[]> => {
    return Promise.resolve([...INITIAL_DECISION_HISTORY]);
  },

  getDataQualityReport: async (): Promise<DataQualityReport> => {
    return Promise.resolve({ ...DATA_QUALITY_METRICS });
  },

  logAdvisoryDecision: async (decision: Omit<DecisionLog, 'id' | 'timestamp'>): Promise<DecisionLog> => {
    const newLog: DecisionLog = {
      ...decision,
      id: `DEC-${Date.now().toString().slice(-8)}`,
      timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB') + ' IST',
    };
    return Promise.resolve(newLog);
  },
};
