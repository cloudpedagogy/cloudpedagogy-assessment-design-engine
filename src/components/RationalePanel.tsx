import React from 'react';
import { useStore } from '../store';

export const RationalePanel: React.FC = () => {
  const { state, updateRationale } = useStore();
  const { rationale } = state;

  return (
    <div className="cp-card">
      <div className="cp-card-header">
        <h2 className="cp-card-title">Rationale & Integrity Settings</h2>
      </div>

      <div className="form-group">
        <label htmlFor="designRationale">Design Rationale</label>
        <textarea 
          id="designRationale"
          value={rationale.designRationale}
          onChange={e => updateRationale({ designRationale: e.target.value })}
          placeholder="Why was this assessment structure chosen? How does it prepare students for future capabilities?"
        />
      </div>

      <div className="form-group">
        <label htmlFor="authenticityConsiderations">Authenticity Considerations</label>
        <textarea 
          id="authenticityConsiderations"
          value={rationale.authenticityConsiderations}
          onChange={e => updateRationale({ authenticityConsiderations: e.target.value })}
          placeholder="How does this assessment suite reflect real-world contexts, tools, or challenges?"
        />
      </div>

      <div className="form-group">
        <label htmlFor="risksOrConcerns">Risks or Concerns (e.g. Academic Integrity)</label>
        <textarea 
          id="risksOrConcerns"
          value={rationale.risksOrConcerns}
          onChange={e => updateRationale({ risksOrConcerns: e.target.value })}
          placeholder="What are the potential risks to academic integrity? How are they mitigated across the programme?"
        />
      </div>

      <div className="form-group">
        <label htmlFor="aiInvolvement">AI Involvement (Overall)</label>
        <textarea 
          id="aiInvolvement"
          value={rationale.aiInvolvement || ''}
          onChange={e => updateRationale({ aiInvolvement: e.target.value })}
          placeholder="Describe the overall role of AI across this assessment plan (optional)..."
          style={{ minHeight: '60px' }}
        />
      </div>

      <div className="form-group mb-0">
        <label htmlFor="designAssumptions">Assumptions</label>
        <textarea 
          id="designAssumptions"
          value={rationale.assumptions || ''}
          onChange={e => updateRationale({ assumptions: e.target.value })}
          placeholder="List any key assumptions made in this design (e.g., student access to tools, prior knowledge)..."
          style={{ minHeight: '60px' }}
        />
      </div>

      {/* Lightweight capability and governance layer */}
      {/* Optional, non-blocking, and does not alter core workflow */}
      <details style={{ marginTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-border-default)', paddingTop: 'var(--spacing-md)' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Capability & Governance Notes (Optional)
        </summary>
        <div className="form-group mt-md mb-0">
          <label htmlFor="capabilityNotes" style={{ fontSize: '0.85rem' }}>Capability Notes</label>
          <textarea 
            id="capabilityNotes"
            className="text-small"
            value={rationale.capabilityNotes || ''}
            onChange={e => updateRationale({ capabilityNotes: e.target.value })}
            placeholder="Consider: What capability this supports, Suggested AI use pattern, Human judgement checkpoint, Reflection prompt, Next capability step..."
            style={{ minHeight: '100px', backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }}
          />
        </div>
      </details>
    </div>
  );
};
