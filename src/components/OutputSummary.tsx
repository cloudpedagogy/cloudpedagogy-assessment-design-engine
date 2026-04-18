import React from 'react';
import { useStore } from '../store';
import { Download } from 'lucide-react';

export const OutputSummary: React.FC = () => {
  const { state } = useStore();
  const { meta, learningOutcomes, assessments, rationale } = state;

  const totalWeighting = assessments.reduce((sum, a) => sum + (Number(a.weighting) || 0), 0);

  const getLOMap = () => {
    const map: Record<string, string> = {};
    learningOutcomes.forEach(lo => {
      map[lo.id] = lo.code ? `${lo.code}` : lo.description;
    });
    return map;
  };

  const loMap = getLOMap();

  return (
    <div className="cp-card cp-hide-print" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
      <div className="cp-card-header">
        <h2 className="cp-card-title">Assessment Summary Output</h2>
        <button className="cp-button-primary" onClick={() => window.print()}>
          <Download size={16} /> Print / Save to PDF
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', padding: 'var(--spacing-lg)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-sm)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)', borderBottom: '2px solid var(--color-border-default)', paddingBottom: 'var(--spacing-md)' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Assessment Plan</h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>
            {meta.programmeName && <span>{meta.programmeName} </span>}
            {meta.moduleName && <span>- {meta.moduleName} </span>}
            {meta.level && <span>({meta.level})</span>}
          </p>
        </div>

        <div className="mb-lg">
          <h3 style={{ borderBottom: '1px solid var(--color-border-default)', paddingBottom: '8px' }}>Learning Outcomes mapping</h3>
          {learningOutcomes.length === 0 ? (
            <p className="text-muted text-small">No learning outcomes defined.</p>
          ) : (
            <ul style={{ paddingLeft: 'var(--spacing-lg)', marginTop: '8px' }}>
              {learningOutcomes.map(lo => (
                <li key={lo.id} style={{ marginBottom: '8px' }}>
                  <strong>{lo.code ? `${lo.code}: ` : ''}</strong> {lo.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-lg">
          <h3 style={{ borderBottom: '1px solid var(--color-border-default)', paddingBottom: '8px' }}>Assessment Design Structure ({totalWeighting}% Total)</h3>
          {assessments.length === 0 ? (
            <p className="text-muted text-small">No assessments defined.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ minWidth: '800px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB' }}>
                    <th style={{ width: '25%' }}>Title & Task</th>
                    <th style={{ width: '15%' }}>Type</th>
                    <th style={{ width: '10%' }}>Weight</th>
                    <th style={{ width: '25%' }}>Learning Outcomes</th>
                    <th style={{ width: '25%' }}>AI Allowability</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map(a => (
                    <tr key={a.id}>
                      <td style={{ verticalAlign: 'top' }}>
                        <strong>{a.title}</strong>
                        <div className="text-small text-muted mt-xs">{a.description}</div>
                        {a.authenticityNotes && (
                          <div className="text-small mt-xs" style={{ backgroundColor: '#eff6ff', padding: '4px', borderRadius: '4px', color: '#1e40af' }}>
                            <strong>Authenticity: </strong> {a.authenticityNotes}
                          </div>
                        )}
                      </td>
                      <td style={{ verticalAlign: 'top' }}>
                        <span className="badge">{a.type || 'Undefined'}</span>
                      </td>
                      <td style={{ verticalAlign: 'top' }}>
                        <strong>{a.weighting}%</strong>
                      </td>
                      <td style={{ verticalAlign: 'top' }}>
                        {a.linkedOutcomeIds.length === 0 ? '-' : (
                          <div className="flex flex-col gap-xs">
                            {a.linkedOutcomeIds.map(id => (
                              <span key={id} className="badge" style={{ backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', alignSelf: 'flex-start' }}>
                                {loMap[id] || 'Unknown LO'}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td style={{ verticalAlign: 'top' }}>
                        <span className="badge mb-xs" style={{ 
                          backgroundColor: a.aiUsageMode === 'allowed' ? '#dcfce7' : a.aiUsageMode === 'conditional' ? '#fef08a' : '#fee2e2',
                          color: a.aiUsageMode === 'allowed' ? '#166534' : a.aiUsageMode === 'conditional' ? '#854d0e' : '#991b1b',
                          border: a.aiUsageMode === 'allowed' ? '1px solid #bbf7d0' : a.aiUsageMode === 'conditional' ? '1px solid #fde047' : '1px solid #fecaca',
                        }}>
                          {a.aiUsageMode === 'allowed' ? 'Allowed' : a.aiUsageMode === 'conditional' ? 'Conditional' : a.aiUsageMode === 'not_allowed' ? 'Not Allowed' : 'Undefined'}
                        </span>
                        <div className="text-small text-muted mt-xs">{a.aiUsageDescription}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mb-lg">
          <h3 style={{ borderBottom: '1px solid var(--color-border-default)', paddingBottom: '8px' }}>Rationale & Integrity</h3>
          <div className="mt-md flex flex-col gap-md">
            <div>
              <strong className="text-small text-muted" style={{ textTransform: 'uppercase' }}>Design Rationale</strong>
              <p>{rationale.designRationale || <span className="text-muted italic">Not specified</span>}</p>
            </div>
            <div>
              <strong className="text-small text-muted" style={{ textTransform: 'uppercase' }}>Authenticity Considerations</strong>
              <p>{rationale.authenticityConsiderations || <span className="text-muted italic">Not specified</span>}</p>
            </div>
            <div>
              <strong className="text-small text-muted" style={{ textTransform: 'uppercase' }}>Risks or Concerns</strong>
              <p>{rationale.risksOrConcerns || <span className="text-muted italic">Not specified</span>}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
