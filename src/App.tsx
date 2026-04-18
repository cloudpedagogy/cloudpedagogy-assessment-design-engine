import React from 'react';
import { StoreProvider } from './store';
import { Header } from './components/Header';
import { PlanMetaPanel } from './components/PlanMetaPanel';
import { LearningOutcomesPanel } from './components/LearningOutcomesPanel';
import { AssessmentDesignPanel } from './components/AssessmentDesignPanel';
import { RationalePanel } from './components/RationalePanel';
import { OutputSummary } from './components/OutputSummary';
import './App.css';

const AppContent: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main className="max-width-container" style={{ flex: 1, width: '100%' }}>
        <p className="text-muted mb-lg">
          Use the panels below to define the parameters of your assessment structure. The system will calculate weightings and construct a unified output. 
          All data is saved locally to your browser automatically.
        </p>

        <PlanMetaPanel />
        <LearningOutcomesPanel />
        <AssessmentDesignPanel />
        <RationalePanel />
        
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <OutputSummary />
        </div>
      </main>

      <footer className="max-width-container" style={{ width: '100%', borderTop: '1px solid var(--color-border-default)', padding: 'var(--spacing-md) var(--spacing-lg)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <p className="mb-0 text-small">CloudPedagogy Assessment Design Engine &middot; Local First Privacy &middot; JSON Portable</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
