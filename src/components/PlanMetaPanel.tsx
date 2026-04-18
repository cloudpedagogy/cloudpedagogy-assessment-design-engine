import React from 'react';
import { useStore } from '../store';

export const PlanMetaPanel: React.FC = () => {
  const { state, updateMeta } = useStore();
  const { meta } = state;

  return (
    <div className="cp-card">
      <div className="cp-card-header">
        <h2 className="cp-card-title">Assessment Plan Details</h2>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="programmeName">Programme / Degree Name</label>
          <input 
            type="text" 
            id="programmeName"
            value={meta.programmeName || ''}
            onChange={(e) => updateMeta({ programmeName: e.target.value })}
            placeholder="e.g. BSc Computer Science"
          />
        </div>
        <div className="form-group">
          <label htmlFor="moduleName">Module / Unit Name</label>
          <input 
            type="text" 
            id="moduleName"
            value={meta.moduleName || ''}
            onChange={(e) => updateMeta({ moduleName: e.target.value })}
            placeholder="e.g. CS101 Introduction to Programming"
          />
        </div>
        <div className="form-group">
          <label htmlFor="level">Academic Level</label>
          <input 
            type="text" 
            id="level"
            value={meta.level || ''}
            onChange={(e) => updateMeta({ level: e.target.value })}
            placeholder="e.g. Level 4 / Year 1"
          />
        </div>
      </div>
    </div>
  );
};
