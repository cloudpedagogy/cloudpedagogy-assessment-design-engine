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
          <input 
            type="text" 
            placeholder="Code (e.g. LO1)" 
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
          />
        </div>
        <div className="form-group mb-0" style={{ flex: 1 }}>
          <input 
            type="text" 
            placeholder="Learning Outcome Description" 
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          />
        </div>
        <button className="cp-button-primary" onClick={handleAdd}>
          <Plus size={16} /> Add
        </button>
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
                />
                <input 
                  type="text" 
                  value={lo.description}
                  onChange={(e) => updateLearningOutcome(lo.id, { description: e.target.value })}
                  style={{ flex: 1 }}
                />
              </div>
              <button 
                className="cp-button-danger ml-md" 
                onClick={() => removeLearningOutcome(lo.id)}
                title="Remove Outcome"
                style={{ padding: '8px' }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
