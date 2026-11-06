import React from 'react';
import { useStore } from '../store';
import type { AssessmentType, AIUsageMode } from '../types';
import { Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { calculateTotalWeighting, isTotalWeightingValid, formatWeighting, sanitizeWeightInput } from '../utils/weighting';

const ASSESSMENT_TYPES: AssessmentType[] = [
  "Essay", "Report", "Presentation", "Project", "Portfolio", 
  "Case Study", "Reflective Writing", "Practical / Lab Task", 
  "Group Assignment", "Exam", "Quiz / Test", "Dissertation / Major Study", "Other"
];

export const AssessmentDesignPanel: React.FC = () => {
  const { state, addAssessment, updateAssessment, removeAssessment } = useStore();
  const { assessments, learningOutcomes } = state;

  const totalWeighting = calculateTotalWeighting(assessments);
  const isWeightingValid = isTotalWeightingValid(totalWeighting);

  return (
    <div className="cp-card">
      <div className="cp-card-header">
        <h2 className="cp-card-title">Assessment Design</h2>
        <div className="flex items-center gap-md">
          <div 
            className={`flex items-center gap-xs \${isWeightingValid ? 'text-success' : 'text-danger'}`} 
            style={{ color: isWeightingValid ? 'var(--color-success)' : 'var(--color-danger)' }}
            aria-live="polite"
            aria-atomic="true"
          >
            {isWeightingValid ? <CheckCircle size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
            <span className="semibold">Total Weighting: {formatWeighting(totalWeighting)}%</span>
          </div>
          <button type="button" className="cp-button-primary" onClick={addAssessment} aria-label="Add Assessment">
            <Plus size={16} aria-hidden="true" /> Add Assessment
          </button>
        </div>
      </div>

      {assessments.length === 0 ? (
        <p className="text-muted text-center" style={{ padding: '2rem 0' }}>No assessments added. Click "Add Assessment" to begin.</p>
      ) : (
        <div className="flex-col gap-lg mt-md">
          {assessments.map((assessment, index) => (
            <div key={assessment.id} className="list-item-box" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex justify-between items-center mb-md pb-sm" style={{ borderBottom: '1px solid var(--color-border-default)' }}>
                <h3 className="mb-0">Assessment {index + 1}</h3>
                <button 
                  type="button"
                  className="cp-button-danger" 
                  onClick={() => removeAssessment(assessment.id)}
                  aria-label={`Delete assessment ${assessment.title || index + 1}`}
                >
                  <Trash2 size={16} aria-hidden="true" /> Delete
                </button>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label htmlFor={`assessment-title-${assessment.id}`}>Title</label>
                  <input 
                    type="text" 
                    id={`assessment-title-${assessment.id}`}
                    value={assessment.title}
                    onChange={e => updateAssessment(assessment.id, { title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`assessment-type-${assessment.id}`}>Type</label>
                  <select 
                    id={`assessment-type-${assessment.id}`}
                    value={assessment.type}
                    onChange={e => updateAssessment(assessment.id, { type: e.target.value as AssessmentType })}
                  >
                    <option value="" disabled>Select Type</option>
                    {ASSESSMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor={`assessment-weight-${assessment.id}`}>Weighting (%)</label>
                  <input 
                    type="number" 
                    id={`assessment-weight-${assessment.id}`}
                    min="0" 
                    max="100"
                    step="any"
                    value={assessment.weighting === 0 && assessment.title === 'New Assessment' ? '' : assessment.weighting}
                    onChange={e => updateAssessment(assessment.id, { weighting: sanitizeWeightInput(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`assessment-desc-${assessment.id}`}>Description & Task Details</label>
                <textarea 
                  id={`assessment-desc-${assessment.id}`}
                  value={assessment.description}
                  onChange={e => updateAssessment(assessment.id, { description: e.target.value })}
                  placeholder="Describe the assessment task..."
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label id={`assessment-lo-label-${assessment.id}`}>Linked Learning Outcomes</label>
                  <div 
                    role="group"
                    aria-labelledby={`assessment-lo-label-${assessment.id}`}
                    style={{ border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-sm)', padding: 'var(--spacing-sm)', maxHeight: '120px', overflowY: 'auto' }}
                  >
                    {learningOutcomes.length === 0 && <span className="text-muted text-small">No learning outcomes defined yet.</span>}
                    {learningOutcomes.map(lo => {
                      const isLinked = assessment.linkedOutcomeIds.includes(lo.id);
                      const checkboxId = `lo-checkbox-${assessment.id}-${lo.id}`;
                      return (
                        <div key={lo.id} className="flex items-center gap-sm mb-0" style={{ padding: '4px 0' }}>
                          <input 
                            type="checkbox" 
                            id={checkboxId}
                            style={{ width: 'auto' }}
                            checked={isLinked}
                            onChange={() => {
                              const newLinked = isLinked 
                                ? assessment.linkedOutcomeIds.filter(id => id !== lo.id)
                                : [...assessment.linkedOutcomeIds, lo.id];
                              updateAssessment(assessment.id, { linkedOutcomeIds: newLinked });
                            }}
                          />
                          <label htmlFor={checkboxId} className="text-small mb-0" style={{ fontWeight: 400, cursor: 'pointer' }}>
                            {lo.code ? `${lo.code}: ` : ''}{lo.description}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label htmlFor={`assessment-aimode-${assessment.id}`}>AI Usage Allowability</label>
                  <select 
                    id={`assessment-aimode-${assessment.id}`}
                    value={assessment.aiUsageMode}
                    onChange={e => updateAssessment(assessment.id, { aiUsageMode: e.target.value as AIUsageMode })}
                  >
                    <option value="" disabled>Select AI Mode</option>
                    <option value="allowed">Allowed</option>
                    <option value="conditional">Conditional Use</option>
                    <option value="not_allowed">Not Allowed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`assessment-aidesc-${assessment.id}`}>AI Usage Description / Guidelines</label>
                <textarea 
                  id={`assessment-aidesc-${assessment.id}`}
                  value={assessment.aiUsageDescription}
                  onChange={e => updateAssessment(assessment.id, { aiUsageDescription: e.target.value })}
                  placeholder="Detail exactly how AI can or cannot be used. E.g. 'Students may use AI for brainstorming but not for drafting text...'"
                  style={{ minHeight: '60px' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor={`assessment-auth-${assessment.id}`}>Authenticity Notes</label>
                <input 
                  type="text" 
                  id={`assessment-auth-${assessment.id}`}
                  value={assessment.authenticityNotes}
                  onChange={e => updateAssessment(assessment.id, { authenticityNotes: e.target.value })}
                  placeholder="How is this task authentic? (e.g., 'Simulates a real-world client report')"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`assessment-rationale-${assessment.id}`} className="text-small">Rationale</label>
                  <textarea 
                    id={`assessment-rationale-${assessment.id}`}
                    value={assessment.rationale || ''}
                    onChange={e => updateAssessment(assessment.id, { rationale: e.target.value })}
                    placeholder="Specific reasoning for this task..."
                    style={{ minHeight: '60px', fontSize: '0.875rem' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`assessment-risks-${assessment.id}`} className="text-small">Risks / Concerns</label>
                  <textarea 
                    id={`assessment-risks-${assessment.id}`}
                    value={assessment.risksOrConcerns || ''}
                    onChange={e => updateAssessment(assessment.id, { risksOrConcerns: e.target.value })}
                    placeholder="Integrity or delivery risks..."
                    style={{ minHeight: '60px', fontSize: '0.875rem' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`assessment-assump-${assessment.id}`} className="text-small">Assumptions</label>
                  <textarea 
                    id={`assessment-assump-${assessment.id}`}
                    value={assessment.assumptions || ''}
                    onChange={e => updateAssessment(assessment.id, { assumptions: e.target.value })}
                    placeholder="Key assumptions (optional)..."
                    style={{ minHeight: '60px', fontSize: '0.875rem' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
