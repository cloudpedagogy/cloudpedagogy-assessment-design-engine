import React from 'react';
import { StoreProvider } from './store';
import { ErrorBoundary } from './components/ErrorBoundary';
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
      <div className="cp-hide-print">
        <Header />
      </div>
      
      <main className="max-width-container" style={{ flex: 1, width: '100%' }}>
        <div className="cp-hide-print">
          <p className="text-muted mb-lg">
            Use the panels below to define the parameters of your assessment structure. The system will calculate weightings and construct a unified output. 
            All data is saved locally to your browser automatically.
          </p>

          <PlanMetaPanel />
          <LearningOutcomesPanel />
          <AssessmentDesignPanel />
          <RationalePanel />
        </div>
        
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <OutputSummary />
        </div>
      </main>

      <footer className="max-width-container cp-hide-print" style={{ width: '100%', borderTop: '1px solid var(--color-border-default)', padding: 'var(--spacing-md) var(--spacing-lg)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <p className="mb-0 text-small">CloudPedagogy Assessment Design Engine &middot; Local First Privacy &middot; JSON Portable</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}

export default App;
