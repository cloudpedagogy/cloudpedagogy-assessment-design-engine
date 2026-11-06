import React, { useRef } from 'react';
import { useStore } from '../store';
import { Download, Upload, Trash2, BookOpen } from 'lucide-react';
import { validateImportJSON } from '../utils/validation';

export const Header: React.FC = () => {
  const { exportJSON, importJSON, resetState, loadDemoData } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const json = JSON.parse(text);
        const result = validateImportJSON(json);
        if (result.success) {
          importJSON(result.data);
        } else {
          alert(`Invalid file format: ${result.error}\n\nYour current assessment design was preserved.`);
        }
      } catch {
        alert('Failed to parse JSON file: The selected file is not valid JSON.\n\nYour current assessment design was preserved.');
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-border-default)', padding: 'var(--spacing-md) 0' }}>
      <div className="max-width-container flex justify-between items-center" style={{ padding: '0 var(--spacing-md)' }}>
        <div className="flex items-center gap-sm">
          <BookOpen size={24} />
          <div>
            <h1 className="mb-0" style={{ fontSize: '1.25rem' }}>CloudPedagogy Assessment Design Engine</h1>
            <p className="mb-0 text-small text-muted">Design structured, AI-aware assessment systems.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-sm">
          <button type="button" className="cp-button-secondary" onClick={loadDemoData} title="Load Demo Example" aria-label="Load Demo Example">
            <BookOpen size={16} aria-hidden="true" /> Load Demo
          </button>
          <button type="button" className="cp-button-secondary" onClick={handleImportClick} title="Import JSON" aria-label="Import Assessment Plan from JSON">
            <Upload size={16} aria-hidden="true" /> Import
          </button>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            aria-label="Upload JSON configuration file"
          />
          <button type="button" className="cp-button-secondary" onClick={exportJSON} title="Export JSON" aria-label="Export Assessment Plan to JSON">
            <Download size={16} aria-hidden="true" /> Export
          </button>
          <button type="button" className="cp-button-danger" onClick={resetState} title="Clear Workspace" aria-label="Clear Entire Workspace">
            <Trash2 size={16} aria-hidden="true" /> Clear
          </button>
        </div>
      </div>
    </header>
  );
};
