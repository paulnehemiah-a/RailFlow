import React, { useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Play,
  Pause,
  CheckCircle2,
  GitMerge,
  Sliders,
  Award,
  AlertTriangle,
  Layers,
  Train,
} from 'lucide-react';
import { useRailFlowStore } from '../../store/railflowStore';
import confetti from 'canvas-confetti';

interface DemoStepInfo {
  step: number;
  title: string;
  badge: string;
  narrative: string;
  actionHint: string;
  icon: React.ReactNode;
}

export const DEMO_STEPS: DemoStepInfo[] = [
  {
    step: 0,
    title: '1. Three Departmental Maintenance Requests Arrive',
    badge: 'Problem Definition',
    narrative:
      'Civil Engineering requests track tamping (MT-ENG-041), S&T requests point machine overhaul (MT-SNT-018), and Traction/OHE requests catenary inspection (MT-TRD-007) on the Southern Railway Chord Line.',
    actionHint: 'Notice elevated failure risk scores (38% for overdue S&T point machine).',
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
  },
  {
    step: 1,
    title: '2. Spatial Overlap Detected on Villupuram–Vriddhachalam',
    badge: 'Intelligence Layer',
    narrative:
      'RailFlow scans corridor topology and identifies that all 3 tasks fall on the identical 54km UP chord section (S-VM-VRI).',
    actionHint: 'In traditional siloed planning, this would trigger 3 separate track closures.',
    icon: <Layers className="w-5 h-5 text-sky-500" />,
  },
  {
    step: 2,
    title: '3. Multi-Department Compatibility Bundling',
    badge: 'Consolidation Engine',
    narrative:
      'RailFlow applies compatibility rules: Track tamping and point overhaul can proceed concurrently under an OHE 25kV power isolation window.',
    actionHint: 'Reduces 3 separate closures to 1 synchronized block (66.7% closure reduction).',
    icon: <GitMerge className="w-5 h-5 text-teal-500" />,
  },
  {
    step: 3,
    title: '4. 12635 Vaigai Superfast Express & Traffic Integrated',
    badge: 'Traffic Integration',
    narrative:
      'Corridor traffic is evaluated: 12635 Vaigai SF Express (MS 13:15 → MDU 20:35), 12606 Pallavan Express, 16127 Guruvayur Express, and 56706 Passenger.',
    actionHint: '12635 Vaigai Express is tagged with HIGH Priority constraint in CP-SAT solver.',
    icon: <Train className="w-5 h-5 text-indigo-500" />,
  },
  {
    step: 4,
    title: '5. CP-SAT Optimization Solver Executed',
    badge: 'Constraint Solver',
    narrative:
      'RailFlow executes an 11-stage constraint satisfaction check (CP-SAT) across the 24-hour timetable horizon.',
    actionHint: 'Evaluates hard constraints (Vaigai protection, headway) against soft objectives (delay minimization).',
    icon: <Sliders className="w-5 h-5 text-blue-500" />,
  },
  {
    step: 5,
    title: '6. Candidate Window Evaluation & Vaigai Conflict Check',
    badge: 'Candidate Generation',
    narrative:
      'Option C (14:30–17:00) causes 40m delay and DIRECTLY INTERSECTS 12635 Vaigai Express at 15:30. Option A causes 64m delay to morning trains.',
    actionHint: 'Option B (11:30–14:00) yields only 18m delay with 12635 Vaigai Express 100% PROTECTED.',
    icon: <Sliders className="w-5 h-5 text-emerald-500" />,
  },
  {
    step: 6,
    title: '7. Downstream Delay Cascade Simulation',
    badge: 'Downstream Physics',
    narrative:
      'RailFlow simulates propagation: Option B completes at 14:00; when 12635 Vaigai arrives at Villupuram at 15:30, it receives 100% green line clear aspects.',
    actionHint: 'Zero ripple delay into Tiruchchirappalli and Madurai junctions.',
    icon: <Layers className="w-5 h-5 text-amber-500" />,
  },
  {
    step: 7,
    title: '8. CP-SAT Selects Option B (Mid-Day Window)',
    badge: 'Optimal Selection',
    narrative:
      'Option B achieves the lowest impact score (24/100) and satisfies 100% of hard constraints.',
    actionHint: 'Continuous Tamping Machine CSM-09 and Tower Wagon TW-04 confirmed available at Villupuram siding.',
    icon: <CheckCircle2 className="w-5 h-5 text-teal-500" />,
  },
  {
    step: 8,
    title: '9. Transparent & Explainable AI Reasoning',
    badge: 'Explainable AI',
    narrative:
      'RailFlow presents a structured rationale ("WHY THIS BLOCK?") and data confidence metric (HIGH / 92%).',
    actionHint: 'Explains exact mathematical criteria: 12635 Vaigai Express protected + 3 tasks consolidated.',
    icon: <Sparkles className="w-5 h-5 text-purple-500" />,
  },
  {
    step: 9,
    title: '10. Human-in-the-Loop Controller Advisory Approval',
    badge: 'Advisory Audit',
    narrative:
      'The Chief Controller confirms advisory approval. 3 separate closures collapse into 1 block, saving 46 minutes of passenger delay.',
    actionHint: 'Review the Controller Advisory Decision Audit History ledger.',
    icon: <Award className="w-5 h-5 text-purple-600" />,
  },
  {
    step: 10,
    title: '11. What-If Simulator: "Protect Vaigai Express"',
    badge: 'Dynamic What-If',
    narrative:
      'Controllers test shifting the block to 14:30 and observe immediate red conflict warnings on 12635 Vaigai Express.',
    actionHint: 'Demonstrates why the optimizer selected Option B over afternoon alternatives.',
    icon: <Sliders className="w-5 h-5 text-sky-600" />,
  },
  {
    step: 11,
    title: '12. Emergency Replanning Workflow',
    badge: 'Emergency Action',
    narrative:
      'A critical track fracture occurs on KM 165/2 ahead of 12635 Vaigai Express. RailFlow instantly recalculates an emergency 90-min window (10:00–11:30) to secure line safety.',
    actionHint: '3 departments. 1 coordinated block. Vaigai Express protected. Human remains in control.',
    icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
  },
];

export const DemoModeOverlay: React.FC = () => {
  const {
    isDemoMode,
    demoStep,
    nextDemoStep,
    prevDemoStep,
    stopDemoMode,
    demoAutoPlay,
    toggleDemoAutoPlay,
    setDemoStep,
    startOptimization,
  } = useRailFlowStore();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isDemoMode && demoAutoPlay) {
      timer = setTimeout(() => {
        if (demoStep < DEMO_STEPS.length - 1) {
          nextDemoStep();
        } else {
          toggleDemoAutoPlay();
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [isDemoMode, demoAutoPlay, demoStep, nextDemoStep, toggleDemoAutoPlay]);

  // Trigger solver animation when entering solver step
  useEffect(() => {
    if (isDemoMode && demoStep === 4) {
      startOptimization();
    }
    if (isDemoMode && demoStep === 9) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    }
  }, [isDemoMode, demoStep, startOptimization]);

  if (!isDemoMode) return null;

  const currentInfo = DEMO_STEPS[demoStep] || DEMO_STEPS[0];
  const progressPercent = ((demoStep + 1) / DEMO_STEPS.length) * 100;

  return (
    <div className="fixed bottom-10 right-8 z-50 max-w-lg w-full bg-white border-2 border-railway-blue rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-railway-dark to-railway-blue text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-railway-teal animate-spin" />
          <span className="font-extrabold text-xs tracking-wider uppercase text-slate-100">
            Demonstration
          </span>
          <span className="text-[10px] bg-railway-teal text-slate-900 font-bold px-1.5 py-0.2 rounded">
            Step {demoStep + 1} of {DEMO_STEPS.length}
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={toggleDemoAutoPlay}
            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 transition ${
              demoAutoPlay ? 'bg-amber-400 text-slate-900' : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            {demoAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{demoAutoPlay ? 'Auto (7s)' : 'Auto-Play'}</span>
          </button>
          <button
            onClick={stopDemoMode}
            className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5">
        <div
          className="bg-railway-teal h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Content Body */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-slate-100 border border-slate-200">
              {currentInfo.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-railway-blue px-2 py-0.5 rounded bg-railway-lightBlue border border-railway-blue/20">
                {currentInfo.badge}
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-0.5 leading-snug">
                {currentInfo.title}
              </h4>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
          {currentInfo.narrative}
        </p>

        <div className="flex items-center space-x-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-md border border-amber-200 font-medium">
          <span className="font-bold">Key Insight:</span>
          <span>{currentInfo.actionHint}</span>
        </div>

        {/* Step dots & Navigation Controls */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center space-x-1 overflow-x-auto py-1">
            {DEMO_STEPS.map((s) => (
              <button
                key={s.step}
                onClick={() => setDemoStep(s.step)}
                className={`w-2 h-2 rounded-full transition-all ${
                  s.step === demoStep
                    ? 'w-5 bg-railway-blue rounded-md'
                    : s.step < demoStep
                    ? 'bg-railway-teal'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Jump to Step ${s.step + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={prevDemoStep}
              disabled={demoStep === 0}
              className="px-2.5 py-1 rounded text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (demoStep < DEMO_STEPS.length - 1) nextDemoStep();
                else stopDemoMode();
              }}
              className="px-3.5 py-1 rounded bg-railway-blue hover:bg-railway-dark text-white text-xs font-bold shadow-sm flex items-center space-x-1 transition"
            >
              <span>{demoStep === DEMO_STEPS.length - 1 ? 'Finish Showcase' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
