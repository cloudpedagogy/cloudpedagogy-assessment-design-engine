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
        <label>Design Rationale</label>
        <textarea 
          value={rationale.designRationale}
          onChange={e => updateRationale({ designRationale: e.target.value })}
          placeholder="Why was this assessment structure chosen? How does it prepare students for future capabilities?"
        />
      </div>

      <div className="form-group">
        <label>Authenticity Considerations</label>
        <textarea 
          value={rationale.authenticityConsiderations}
          onChange={e => updateRationale({ authenticityConsiderations: e.target.value })}
          placeholder="How does this assessment suite reflect real-world contexts, tools, or challenges?"
        />
      </div>

      <div className="form-group">
        <label>Risks or Concerns (e.g. Academic Integrity)</label>
        <textarea 
          value={rationale.risksOrConcerns}
          onChange={e => updateRationale({ risksOrConcerns: e.target.value })}
          placeholder="What are the potential risks to academic integrity? How are they mitigated across the programme?"
        />
      </div>

      <div className="form-group">
        <label>AI Involvement (Overall)</label>
        <textarea 
          value={rationale.aiInvolvement || ''}
          onChange={e => updateRationale({ aiInvolvement: e.target.value })}
          placeholder="Describe the overall role of AI across this assessment plan (optional)..."
          style={{ minHeight: '60px' }}
        />
      </div>

      <div className="form-group mb-0">
        <label>Assumptions</label>
        <textarea 
          value={rationale.assumptions || ''}
          onChange={e => updateRationale({ assumptions: e.target.value })}
          placeholder="List any key assumptions made in this design (e.g., student access to tools, prior knowledge)..."
          style={{ minHeight: '60px' }}
        />
      </div>
    </div>
  );
};
