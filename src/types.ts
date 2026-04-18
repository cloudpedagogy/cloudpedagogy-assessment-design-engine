export interface LearningOutcome {
  id: string;
  code?: string;
  description: string;
}

export type AssessmentType =
  | "Essay" | "Report" | "Presentation" | "Project"
  | "Portfolio" | "Case Study" | "Reflective Writing"
  | "Practical / Lab Task" | "Group Assignment" | "Exam"
  | "Quiz / Test" | "Dissertation / Major Study" | "Other"
  | "";

export type AIUsageMode = "allowed" | "conditional" | "not_allowed" | "";

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: AssessmentType;
  weighting: number;
  linkedOutcomeIds: string[];
  aiUsageMode: AIUsageMode;
  aiUsageDescription: string;
  authenticityNotes: string;
  feedbackApproach?: string;
  submissionMode?: string;
}

export interface AssessmentPlanMeta {
  programmeName?: string;
  moduleName?: string;
  level?: string;
}

export interface Rationale {
  designRationale: string;
  authenticityConsiderations: string;
  risksOrConcerns: string;
}

export interface AppState {
  meta: AssessmentPlanMeta;
  learningOutcomes: LearningOutcome[];
  assessments: Assessment[];
  rationale: Rationale;
  lastUpdated: string;
}
