import React from 'react';
import { useRailFlowStore } from './store/railflowStore';
import { TopNavbar } from './components/layout/TopNavbar';
import { Sidebar } from './components/layout/Sidebar';
import { StatusBar } from './components/layout/StatusBar';
import { DemoModeOverlay } from './components/layout/DemoModeOverlay';
import { ApprovalModal } from './components/layout/ApprovalModal';

// Pages
import { Operations } from './pages/Operations';
import { MaintenanceIntelligence } from './pages/MaintenanceIntelligence';
import { BlockPlanner } from './pages/BlockPlanner';
import { Coordination } from './pages/Coordination';
import { ScenarioAnalysis } from './pages/ScenarioAnalysis';
import { EmergencyReplanning } from './pages/EmergencyReplanning';
import { WeeklyMonthlyPlanning } from './pages/WeeklyMonthlyPlanning';
import { BeforeVsRailFlow } from './pages/BeforeVsRailFlow';
import { Analytics } from './pages/Analytics';
import { DataQuality } from './pages/DataQuality';
import { Configuration } from './pages/Configuration';

export const App: React.FC = () => {
  const { activeView } = useRailFlowStore();

  const renderActivePage = () => {
    switch (activeView) {
      case 'operations':
        return <Operations />;
      case 'maintenance':
        return <MaintenanceIntelligence />;
      case 'planner':
        return <BlockPlanner />;
      case 'coordination':
        return <Coordination />;
      case 'scenarios':
        return <ScenarioAnalysis />;
      case 'emergency':
        return <EmergencyReplanning />;
      case 'weekly-monthly':
        return <WeeklyMonthlyPlanning />;
      case 'hero-before-after':
        return <BeforeVsRailFlow />;
      case 'analytics':
        return <Analytics />;
      case 'data-quality':
        return <DataQuality />;
      case 'configuration':
        return <Configuration />;
      default:
        return <Operations />;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-railway-bg font-sans overflow-hidden text-slate-800">
      {/* Top Navigation Bar */}
      <TopNavbar />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic Center/Right Page Content */}
        <main className="flex-1 overflow-y-auto bg-railway-bg">
          {renderActivePage()}
        </main>
      </div>

      {/* Bottom Advisory Status Bar */}
      <StatusBar />

      {/* Global Interactive Overlays */}
      <DemoModeOverlay />
      <ApprovalModal />
    </div>
  );
};

export default App;
