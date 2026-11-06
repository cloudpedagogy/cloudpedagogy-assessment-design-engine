import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { AppState, LearningOutcome, Assessment, AssessmentPlanMeta, Rationale } from './types';
import { v4 as uuidv4 } from 'uuid';
import { emptyState, normalizeState } from './utils/validation';

export const STORAGE_KEY = 'cloudpedagogy_assessment_engine';
export const STORAGE_BACKUP_KEY = 'cloudpedagogy_assessment_engine_corrupted_backup';

export { emptyState };

export const demoState: AppState = {
  meta: {
    programmeName: "Master of Public Health",
    moduleName: "Health Policy Analysis",
    level: "Postgraduate"
  },
  learningOutcomes: [
    {
      id: "LO1",
      code: "LO1",
      description: "Critically analyse contemporary public health policy issues using appropriate theoretical frameworks"
    },
    {
      id: "LO2",
      code: "LO2",
      description: "Apply evidence from academic and policy sources to support policy arguments"
    },
    {
      id: "LO3",
      code: "LO3",
      description: "Communicate complex policy analysis clearly in written form"
    }
  ],
  assessments: [
    {
      id: "A1",
      title: "Policy Analysis Essay",
      description: "A 3,000-word essay analysing a current public health policy issue, including evaluation of policy options and recommendations.",
      type: "Essay",
      weighting: 70,
      linkedOutcomeIds: ["LO1", "LO2", "LO3"],
      aiUsageMode: "conditional",
      aiUsageDescription: "Limited use of AI tools is permitted for brainstorming, outlining, and improving clarity, but not for generating final arguments or full text.",
      authenticityNotes: "Students must demonstrate independent critical analysis and clearly show their reasoning process.",
      feedbackApproach: "Written feedback with focus on argument quality, evidence use, and clarity",
      submissionMode: "Coursework"
    },
    {
      id: "A2",
      title: "Policy Brief Presentation",
      description: "A 10-minute presentation summarising a public health policy issue and proposing evidence-based recommendations.",
      type: "Presentation",
      weighting: 30,
      linkedOutcomeIds: ["LO1", "LO3"],
      aiUsageMode: "conditional",
      aiUsageDescription: "AI tools may be used to support preparation (e.g. structuring slides), but not to generate the full presentation content without critical engagement.",
      authenticityNotes: "Students must be able to explain and defend their recommendations during Q&A.",
      feedbackApproach: "Oral and written feedback focusing on clarity, argument, and engagement",
      submissionMode: "Oral"
    }
  ],
  rationale: {
    designRationale: "The assessment strategy is designed to develop and evaluate students’ ability to analyse public health policy issues, apply evidence, and communicate arguments effectively in both written and oral formats.",
    authenticityConsiderations: "Authenticity is supported through tasks requiring critical analysis, synthesis of evidence, and real-time explanation of reasoning.",
    risksOrConcerns: "Potential over-reliance on AI tools for generating arguments or written content without sufficient critical engagement."
  },
  lastUpdated: new Date().toISOString()
};

export interface StoreContextType {
  state: AppState;
  updateMeta: (meta: AssessmentPlanMeta) => void;
  addLearningOutcome: (outcome: Omit<LearningOutcome, 'id'>) => void;
  updateLearningOutcome: (id: string, outcome: Partial<LearningOutcome>) => void;
  removeLearningOutcome: (id: string) => void;
  addAssessment: () => void;
  updateAssessment: (id: string, assessment: Partial<Assessment>) => void;
  removeAssessment: (id: string) => void;
  updateRationale: (rationale: Partial<Rationale>) => void;
  exportJSON: () => void;
  importJSON: (data: AppState) => void;
  resetState: () => void;
  loadDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDirtyRef = useRef<boolean>(false);

  const saveCorruptedBackup = (rawCorrupted: string) => {
    try {
      // Ensure repeated recovery attempts cannot overwrite/destroy the original backup
      const existingBackup = localStorage.getItem(STORAGE_BACKUP_KEY);
      if (!existingBackup && rawCorrupted) {
        localStorage.setItem(STORAGE_BACKUP_KEY, rawCorrupted);
      }
    } catch {
      // Ignore storage quota errors
    }
  };

  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        let parsed: unknown;
        try {
          parsed = JSON.parse(saved);
        } catch (e) {
          console.warn("Storage contains invalid JSON; preserving raw data non-destructively", e);
          saveCorruptedBackup(saved);
          return emptyState;
        }

        if (typeof parsed === 'object' && parsed !== null) {
          return normalizeState(parsed);
        } else {
          console.warn("Storage contains non-object payload; preserving raw data non-destructively");
          saveCorruptedBackup(saved);
          return emptyState;
        }
      }
    } catch (e) {
      console.error("Failed to read from localStorage", e);
    }
    return emptyState;
  });

  useEffect(() => {
    // Non-destructive safeguard: if storage held unparseable data and user hasn't made mutations,
    // avoid silently overwriting the original raw data on mount.
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (existing && !isDirtyRef.current) {
        try {
          const parsed = JSON.parse(existing);
          if (typeof parsed !== 'object' || parsed === null) {
            return;
          }
        } catch {
          return;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to write to localStorage", e);
    }
  }, [state]);

  const updateState = (updater: Partial<AppState> | ((prev: AppState) => Partial<AppState>)) => {
    isDirtyRef.current = true;
    setState(prev => {
      const updates = typeof updater === 'function' ? updater(prev) : updater;
      return { ...prev, ...updates, lastUpdated: new Date().toISOString() };
    });
  };

  const updateMeta = (meta: AssessmentPlanMeta) => {
    updateState(prev => ({ meta: { ...prev.meta, ...meta } }));
  };

  const addLearningOutcome = (outcome: Omit<LearningOutcome, 'id'>) => {
    const newOutcome = { ...outcome, id: uuidv4() };
    updateState(prev => ({ learningOutcomes: [...prev.learningOutcomes, newOutcome] }));
  };

  const updateLearningOutcome = (id: string, outcomeUpdate: Partial<LearningOutcome>) => {
    updateState(prev => ({
      learningOutcomes: prev.learningOutcomes.map(o => o.id === id ? { ...o, ...outcomeUpdate } : o)
    }));
  };

  const removeLearningOutcome = (id: string) => {
    // Also remove reference from assessments
    updateState(prev => ({
      learningOutcomes: prev.learningOutcomes.filter(o => o.id !== id),
      assessments: prev.assessments.map(a => ({
        ...a,
        linkedOutcomeIds: Array.isArray(a.linkedOutcomeIds) ? a.linkedOutcomeIds.filter(lid => lid !== id) : []
      }))
    }));
  };

  const addAssessment = () => {
    const newAssessment: Assessment = {
      id: uuidv4(),
      title: 'New Assessment',
      description: '',
      type: '',
      weighting: 0,
      linkedOutcomeIds: [],
      aiUsageMode: '',
      aiUsageDescription: '',
      authenticityNotes: '',
      feedbackApproach: '',
      submissionMode: '',
      rationale: '',
      risksOrConcerns: '',
      assumptions: ''
    };
    updateState(prev => ({ assessments: [...prev.assessments, newAssessment] }));
  };

  const updateAssessment = (id: string, update: Partial<Assessment>) => {
    updateState(prev => ({
      assessments: prev.assessments.map(a => a.id === id ? { ...a, ...update } : a)
    }));
  };

  const removeAssessment = (id: string) => {
    updateState(prev => ({ assessments: prev.assessments.filter(a => a.id !== id) }));
  };

  const updateRationale = (rationaleUpdate: Partial<Rationale>) => {
    updateState(prev => ({ rationale: { ...prev.rationale, ...rationaleUpdate } }));
  };

  const exportJSON = () => {
    const jsonString = JSON.stringify(state, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dt = new Date();
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', url);
    downloadAnchorNode.setAttribute('download', `assessment_design_${dt.getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const importJSON = (data: AppState) => {
    isDirtyRef.current = true;
    setState(normalizeState(data));
  };

  const resetState = () => {
    if (confirm("Are you sure you want to completely clear the workspace? This cannot be undone.")) {
      isDirtyRef.current = true;
      setState(emptyState);
    }
  };

  const loadDemoData = () => {
    isDirtyRef.current = true;
    setState({ ...demoState, lastUpdated: new Date().toISOString() });
  };

  return (
    <StoreContext.Provider value={{
      state,
      updateMeta,
      addLearningOutcome,
      updateLearningOutcome,
      removeLearningOutcome,
      addAssessment,
      updateAssessment,
      removeAssessment,
      updateRationale,
      exportJSON,
      importJSON,
      resetState,
      loadDemoData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
