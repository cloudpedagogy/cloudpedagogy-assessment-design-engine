import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, X } from 'lucide-react';

export const LearningOutcomesPanel: React.FC = () => {
  const { state, addLearningOutcome, updateLearningOutcome, removeLearningOutcome } = useStore();
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAdd = () => {
    if (!newDescription.trim()) return;
    addLearningOutcome({
      code: newCode.trim(),
      description: newDescription.trim()
    });
    setNewCode('');
    setNewDescription('');
  };

  return (
    <div className="cp-card">
      <div className="cp-card-header">
        <h2 className="cp-card-title">Learning Outcomes</h2>
      </div>
      
      <div className="form-row items-center">
        <div className="form-group mb-0" style={{ flex: '0 0 150px' }}>
          <label htmlFor="new-lo-code" className="text-small">Outcome Code</label>
          <input 
            type="text" 
            id="new-lo-code"
            placeholder="Code (e.g. LO1)" 
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
          />
        </div>
        <div className="form-group mb-0" style={{ flex: 1 }}>
          <label htmlFor="new-lo-desc" className="text-small">Outcome Description</label>
          <input 
            type="text" 
            id="new-lo-desc"
            placeholder="Learning Outcome Description" 
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          />
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <button type="button" className="cp-button-primary" onClick={handleAdd} aria-label="Add learning outcome">
            <Plus size={16} aria-hidden="true" /> Add
          </button>
        </div>
      </div>

      {state.learningOutcomes.length > 0 && (
        <div className="mt-md flex-col gap-sm">
          {state.learningOutcomes.map(lo => (
            <div key={lo.id} className="list-item-box flex items-center justify-between">
              <div className="flex items-center gap-md" style={{ flex: 1 }}>
                <input 
                  type="text" 
                  value={lo.code || ''}
                  onChange={(e) => updateLearningOutcome(lo.id, { code: e.target.value })}
                  style={{ width: '100px' }}
                  placeholder="Code"
                  aria-label={`Outcome code for ${lo.code || lo.id}`}
                />
                <input 
                  type="text" 
                  value={lo.description}
                  onChange={(e) => updateLearningOutcome(lo.id, { description: e.target.value })}
                  style={{ flex: 1 }}
                  placeholder="Description"
                  aria-label={`Description for outcome ${lo.code || lo.id}`}
                />
              </div>
              <button 
                type="button"
                className="cp-button-danger ml-md" 
                onClick={() => removeLearningOutcome(lo.id)}
                title="Remove Outcome"
                aria-label={`Remove outcome ${lo.code || lo.description}`}
                style={{ padding: '8px' }}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
