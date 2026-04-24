import React from 'react';
import { useStore } from '../store';
import type { AssessmentType, AIUsageMode } from '../types';
import { Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

const ASSESSMENT_TYPES: AssessmentType[] = [
  "Essay", "Report", "Presentation", "Project", "Portfolio", 
  "Case Study", "Reflective Writing", "Practical / Lab Task", 
  "Group Assignment", "Exam", "Quiz / Test", "Dissertation / Major Study", "Other"
];

export const AssessmentDesignPanel: React.FC = () => {
  const { state, addAssessment, updateAssessment, removeAssessment } = useStore();
  const { assessments, learningOutcomes } = state;

  const totalWeighting = assessments.reduce((sum, a) => sum + (Number(a.weighting) || 0), 0);
  const isWeightingValid = totalWeighting === 100;

  return (
    <div className="cp-card">
      <div className="cp-card-header">
        <h2 className="cp-card-title">Assessment Design</h2>
        <div className="flex items-center gap-md">
          <div className={`flex items-center gap-xs \${isWeightingValid ? 'text-success' : 'text-danger'}`} style={{ color: isWeightingValid ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {isWeightingValid ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <span className="semibold">Total Weighting: {totalWeighting}%</span>
          </div>
          <button className="cp-button-primary" onClick={addAssessment}>
            <Plus size={16} /> Add Assessment
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
                <button className="cp-button-danger" onClick={() => removeAssessment(assessment.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Title</label>
                  <input 
                    type="text" 
                    value={assessment.title}
                    onChange={e => updateAssessment(assessment.id, { title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select 
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
                  <label>Weighting (%)</label>
                  <input 
                    type="number" 
                    min="0" max="100"
                    value={assessment.weighting === 0 && assessment.title === 'New Assessment' ? '' : assessment.weighting}
                    onChange={e => updateAssessment(assessment.id, { weighting: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description & Task Details</label>
                <textarea 
                  value={assessment.description}
                  onChange={e => updateAssessment(assessment.id, { description: e.target.value })}
                  placeholder="Describe the assessment task..."
                />
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Linked Learning Outcomes</label>
                  <div style={{ border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-sm)', padding: 'var(--spacing-sm)', maxHeight: '120px', overflowY: 'auto' }}>
                    {learningOutcomes.length === 0 && <span className="text-muted text-small">No learning outcomes defined yet.</span>}
                    {learningOutcomes.map(lo => {
                      const isLinked = assessment.linkedOutcomeIds.includes(lo.id);
                      return (
                        <label key={lo.id} className="flex items-center gap-sm mb-0" style={{ fontWeight: 400, cursor: 'pointer', padding: '4px 0' }}>
                          <input 
                            type="checkbox" 
                            style={{ width: 'auto' }}
                            checked={isLinked}
                            onChange={() => {
                              const newLinked = isLinked 
                                ? assessment.linkedOutcomeIds.filter(id => id !== lo.id)
                                : [...assessment.linkedOutcomeIds, lo.id];
                              updateAssessment(assessment.id, { linkedOutcomeIds: newLinked });
                            }}
                          />
                          <span className="text-small">{lo.code ? `${lo.code}: ` : ''}{lo.description}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="form-group" style={{ flex: 1.5 }}>
                  <label>AI Usage Allowability</label>
                  <select 
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
                <label>AI Usage Description / Guidelines</label>
                <textarea 
                  value={assessment.aiUsageDescription}
                  onChange={e => updateAssessment(assessment.id, { aiUsageDescription: e.target.value })}
                  placeholder="Detail exactly how AI can or cannot be used. E.g. 'Students may use AI for brainstorming but not for drafting text...'"
                  style={{ minHeight: '60px' }}
                />
              </div>

              <div className="form-group">
                <label>Authenticity Notes</label>
                <input 
                  type="text"
                  value={assessment.authenticityNotes}
                  onChange={e => updateAssessment(assessment.id, { authenticityNotes: e.target.value })}
                  placeholder="How is this task authentic? (e.g., 'Simulates a real-world client report')"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="text-small">Rationale</label>
                  <textarea 
                    value={assessment.rationale || ''}
                    onChange={e => updateAssessment(assessment.id, { rationale: e.target.value })}
                    placeholder="Specific reasoning for this task..."
                    style={{ minHeight: '60px', fontSize: '0.875rem' }}
                  />
                </div>
                <div className="form-group">
                  <label className="text-small">Risks / Concerns</label>
                  <textarea 
                    value={assessment.risksOrConcerns || ''}
                    onChange={e => updateAssessment(assessment.id, { risksOrConcerns: e.target.value })}
                    placeholder="Integrity or delivery risks..."
                    style={{ minHeight: '60px', fontSize: '0.875rem' }}
                  />
                </div>
                <div className="form-group">
                  <label className="text-small">Assumptions</label>
                  <textarea 
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
