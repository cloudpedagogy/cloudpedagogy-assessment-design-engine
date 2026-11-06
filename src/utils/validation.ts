import type { AppState, LearningOutcome, Assessment, AssessmentPlanMeta, Rationale, AssessmentType, AIUsageMode } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeWeightInput } from './weighting';

export const emptyState: AppState = {
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

/**
 * Checks whether an unknown value is a non-null Record object.
 */
function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * Safely coerces and sanitizes a weighting value to a number.
 */
export function normalizeWeighting(val: unknown): number {
  if (typeof val === 'number' || typeof val === 'string') {
    return sanitizeWeightInput(val);
  }
  return 0;
}

/**
 * Normalizes an unknown object into a valid LearningOutcome if possible.
 */
function normalizeOutcome(raw: unknown): LearningOutcome | null {
  if (!isRecord(raw)) return null;
  const description = typeof raw.description === 'string' ? raw.description : '';
  const code = typeof raw.code === 'string' ? raw.code : undefined;
  const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id : uuidv4();
  return { id, code, description };
}

/**
 * Normalizes an unknown object into a valid Assessment if possible.
 */
function normalizeAssessment(raw: unknown): Assessment | null {
  if (!isRecord(raw)) return null;
  const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id : uuidv4();
  const title = typeof raw.title === 'string' ? raw.title : 'New Assessment';
  const description = typeof raw.description === 'string' ? raw.description : '';
  const type = (typeof raw.type === 'string' ? raw.type : '') as AssessmentType;
  const weighting = normalizeWeighting(raw.weighting);
  const linkedOutcomeIds = Array.isArray(raw.linkedOutcomeIds)
    ? raw.linkedOutcomeIds.filter((item): item is string => typeof item === 'string')
    : [];
  const aiUsageMode = (typeof raw.aiUsageMode === 'string' ? raw.aiUsageMode : '') as AIUsageMode;
  const aiUsageDescription = typeof raw.aiUsageDescription === 'string' ? raw.aiUsageDescription : '';
  const authenticityNotes = typeof raw.authenticityNotes === 'string' ? raw.authenticityNotes : '';

  const assessment: Assessment = {
    id,
    title,
    description,
    type,
    weighting,
    linkedOutcomeIds,
    aiUsageMode,
    aiUsageDescription,
    authenticityNotes
  };

  if (typeof raw.feedbackApproach === 'string') assessment.feedbackApproach = raw.feedbackApproach;
  if (typeof raw.submissionMode === 'string') assessment.submissionMode = raw.submissionMode;
  if (typeof raw.rationale === 'string') assessment.rationale = raw.rationale;
  if (typeof raw.risksOrConcerns === 'string') assessment.risksOrConcerns = raw.risksOrConcerns;
  if (typeof raw.assumptions === 'string') assessment.assumptions = raw.assumptions;

  return assessment;
}

/**
 * Normalizes an unknown object into AssessmentPlanMeta.
 */
function normalizeMeta(raw: unknown): AssessmentPlanMeta {
  if (!isRecord(raw)) return { programmeName: '', moduleName: '', level: '' };
  return {
    programmeName: typeof raw.programmeName === 'string' ? raw.programmeName : '',
    moduleName: typeof raw.moduleName === 'string' ? raw.moduleName : '',
    level: typeof raw.level === 'string' ? raw.level : ''
  };
}

/**
 * Normalizes an unknown object into Rationale.
 */
function normalizeRationale(raw: unknown): Rationale {
  if (!isRecord(raw)) {
    return {
      designRationale: '',
      authenticityConsiderations: '',
      risksOrConcerns: '',
      aiInvolvement: '',
      assumptions: ''
    };
  }

  const rationale: Rationale = {
    designRationale: typeof raw.designRationale === 'string' ? raw.designRationale : '',
    authenticityConsiderations: typeof raw.authenticityConsiderations === 'string' ? raw.authenticityConsiderations : '',
    risksOrConcerns: typeof raw.risksOrConcerns === 'string' ? raw.risksOrConcerns : ''
  };

  if (typeof raw.aiInvolvement === 'string') rationale.aiInvolvement = raw.aiInvolvement;
  if (typeof raw.assumptions === 'string') rationale.assumptions = raw.assumptions;
  if (typeof raw.capabilityNotes === 'string') rationale.capabilityNotes = raw.capabilityNotes;

  return rationale;
}

/**
 * Non-destructive state normalizer for localStorage data.
 * Safely recovers historical state shapes and handles partial or missing properties
 * without crashing or throwing.
 */
export function normalizeState(raw: unknown): AppState {
  if (!isRecord(raw)) {
    return { ...emptyState, lastUpdated: new Date().toISOString() };
  }

  const meta = normalizeMeta(raw.meta);

  const learningOutcomes: LearningOutcome[] = Array.isArray(raw.learningOutcomes)
    ? raw.learningOutcomes
        .map(normalizeOutcome)
        .filter((o): o is LearningOutcome => o !== null)
    : [];

  const assessments: Assessment[] = Array.isArray(raw.assessments)
    ? raw.assessments
        .map(normalizeAssessment)
        .filter((a): a is Assessment => a !== null)
    : [];

  const rationale = normalizeRationale(raw.rationale);

  const lastUpdated = typeof raw.lastUpdated === 'string' && !isNaN(Date.parse(raw.lastUpdated))
    ? raw.lastUpdated
    : new Date().toISOString();

  return {
    meta,
    learningOutcomes,
    assessments,
    rationale,
    lastUpdated
  };
}

export type ValidationResult = 
  | { success: true; data: AppState }
  | { success: false; error: string };

/**
 * Rigorous structural validation for JSON import files.
 * Rejects genuinely invalid or foreign files while accepting valid historical exports.
 */
export function validateImportJSON(raw: unknown): ValidationResult {
  if (!isRecord(raw)) {
    return {
      success: false,
      error: 'Invalid file format: Expected a valid JSON object.'
    };
  }

  // Must have at least one recognized top-level domain field to avoid arbitrary JSON files
  const recognizedKeys = ['assessments', 'learningOutcomes', 'meta', 'rationale'];
  const hasRecognizedKey = recognizedKeys.some(key => key in raw);
  if (!hasRecognizedKey) {
    return {
      success: false,
      error: 'Unrecognized file structure: File does not contain Assessment Design Engine data.'
    };
  }

  // If assessments property is present, it MUST be an array
  if ('assessments' in raw && !Array.isArray(raw.assessments)) {
    return {
      success: false,
      error: "Invalid structure: 'assessments' field must be an array."
    };
  }

  // If learningOutcomes property is present, it MUST be an array
  if ('learningOutcomes' in raw && !Array.isArray(raw.learningOutcomes)) {
    return {
      success: false,
      error: "Invalid structure: 'learningOutcomes' field must be an array."
    };
  }

  // If assessments array is provided, ensure its items are objects
  if (Array.isArray(raw.assessments)) {
    for (let i = 0; i < raw.assessments.length; i++) {
      const item = raw.assessments[i];
      if (!isRecord(item)) {
        return {
          success: false,
          error: `Invalid assessment record at index ${i}: Expected an object.`
        };
      }
    }
  }

  // If learningOutcomes array is provided, ensure its items are objects
  if (Array.isArray(raw.learningOutcomes)) {
    for (let i = 0; i < raw.learningOutcomes.length; i++) {
      const item = raw.learningOutcomes[i];
      if (!isRecord(item)) {
        return {
          success: false,
          error: `Invalid learning outcome record at index ${i}: Expected an object.`
        };
      }
    }
  }

  // If meta property is present, it must be an object
  if ('meta' in raw && raw.meta !== undefined && !isRecord(raw.meta)) {
    return {
      success: false,
      error: "Invalid structure: 'meta' field must be an object."
    };
  }

  // If rationale property is present, it must be an object
  if ('rationale' in raw && raw.rationale !== undefined && !isRecord(raw.rationale)) {
    return {
      success: false,
      error: "Invalid structure: 'rationale' field must be an object."
    };
  }

  // All structural checks pass -> produce normalized AppState
  const normalized = normalizeState(raw);
  return {
    success: true,
    data: normalized
  };
}
