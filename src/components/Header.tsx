import React, { useRef } from 'react';
import { useStore } from '../store';
import { Download, Upload, Trash2, BookOpen } from 'lucide-react';
import type { AppState } from '../types';

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
        const json = JSON.parse(event.target?.result as string) as AppState;
        // Simple validation check
        if (json && typeof json === 'object' && 'assessments' in json) {
          importJSON(json);
        } else {
          alert('Invalid file format. Please select a valid Assessment Engine JSON export.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
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
          <button className="cp-button-secondary" onClick={loadDemoData} title="Load Demo Example">
            <BookOpen size={16} /> Load Demo
          </button>
          <button className="cp-button-secondary" onClick={handleImportClick} title="Import JSON">
            <Upload size={16} /> Import
          </button>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          <button className="cp-button-secondary" onClick={exportJSON} title="Export JSON">
            <Download size={16} /> Export
          </button>
          <button className="cp-button-danger" onClick={resetState} title="Clear Workspace">
            <Trash2 size={16} /> Clear
          </button>
        </div>
      </div>
    </header>
  );
};
