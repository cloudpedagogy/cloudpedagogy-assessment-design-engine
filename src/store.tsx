import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppState, LearningOutcome, Assessment, AssessmentPlanMeta, Rationale } from './types';
import { v4 as uuidv4 } from 'uuid';

const emptyState: AppState = {
  meta: {
    programmeName: '',
    moduleName: '',
    level: ''
  },
  learningOutcomes: [],
  assessments: [],
  rationale: {
    designRationale: '',
    authenticityConsiderations: '',
    risksOrConcerns: '',
    aiInvolvement: '',
    assumptions: ''
  },
  lastUpdated: new Date().toISOString()
};

const demoState: AppState = {
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

interface StoreContextType {
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
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('cloudpedagogy_assessment_engine');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local state", e);
      }
    }
    return emptyState;
  });

  useEffect(() => {
    localStorage.setItem('cloudpedagogy_assessment_engine', JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates, lastUpdated: new Date().toISOString() }));
  };

  const updateMeta = (meta: AssessmentPlanMeta) => {
    updateState({ meta: { ...state.meta, ...meta } });
  };

  const addLearningOutcome = (outcome: Omit<LearningOutcome, 'id'>) => {
    const newOutcome = { ...outcome, id: uuidv4() };
    updateState({ learningOutcomes: [...state.learningOutcomes, newOutcome] });
  };

  const updateLearningOutcome = (id: string, outcomeUpdate: Partial<LearningOutcome>) => {
    updateState({
      learningOutcomes: state.learningOutcomes.map(o => o.id === id ? { ...o, ...outcomeUpdate } : o)
    });
  };

  const removeLearningOutcome = (id: string) => {
    // Also remove reference from assessments
    const newAssessments = state.assessments.map(a => ({
      ...a,
      linkedOutcomeIds: a.linkedOutcomeIds.filter(lid => lid !== id)
    }));
    updateState({
      learningOutcomes: state.learningOutcomes.filter(o => o.id !== id),
      assessments: newAssessments
    });
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
    updateState({ assessments: [...state.assessments, newAssessment] });
  };

  const updateAssessment = (id: string, update: Partial<Assessment>) => {
    updateState({
      assessments: state.assessments.map(a => a.id === id ? { ...a, ...update } : a)
    });
  };

  const removeAssessment = (id: string) => {
    updateState({ assessments: state.assessments.filter(a => a.id !== id) });
  };

  const updateRationale = (rationaleUpdate: Partial<Rationale>) => {
    updateState({ rationale: { ...state.rationale, ...rationaleUpdate } });
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dt = new Date();
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `assessment_design_${dt.getTime()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importJSON = (data: AppState) => {
    setState(data);
  };

  const resetState = () => {
    if (confirm("Are you sure you want to completely clear the workspace? This cannot be undone.")) {
      setState(emptyState);
    }
  };

  const loadDemoData = () => {
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
