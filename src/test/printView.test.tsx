import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { demoState, STORAGE_KEY } from '../store';

describe('Print View & Assessment Summary Output', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoState));
  });

  it('renders the printable summary container without cp-hide-print', () => {
    const { container } = render(<App />);

    // The printable summary card must NOT have the cp-hide-print class
    const printableSummary = container.querySelector('.printable-summary');
    expect(printableSummary).toBeInTheDocument();
    expect(printableSummary?.classList.contains('cp-hide-print')).toBe(false);
  });

  it('wraps the header, editing panels, and print button with cp-hide-print', () => {
    const { container } = render(<App />);

    // The print trigger header inside OutputSummary should be hidden in print
    const summaryHeader = container.querySelector('.printable-summary .cp-card-header');
    expect(summaryHeader?.classList.contains('cp-hide-print')).toBe(true);

    // The editing forms wrapper must have cp-hide-print
    const hiddenPanels = container.querySelectorAll('.cp-hide-print');
    expect(hiddenPanels.length).toBeGreaterThanOrEqual(3);

    // Check that interactive controls like "Add Assessment" are inside a cp-hide-print container
    const addBtn = screen.getByRole('button', { name: /Add Assessment/i });
    expect(addBtn.closest('.cp-hide-print')).not.toBeNull();
  });

  it('includes complete assessment design data in the printable output', () => {
    const { container } = render(<App />);
    const printableSummary = container.querySelector('.printable-summary');
    expect(printableSummary).not.toBeNull();

    // Programme / Module context
    expect(printableSummary).toHaveTextContent(/Health Policy Analysis/);
    expect(printableSummary).toHaveTextContent(/Master of Public Health/);
    expect(printableSummary).toHaveTextContent(/Postgraduate/);

    // Learning Outcomes mapping
    expect(printableSummary).toHaveTextContent(/Critically analyse contemporary public health policy issues/);

    // Assessment tasks and weightings
    expect(printableSummary).toHaveTextContent('Policy Analysis Essay');
    expect(printableSummary).toHaveTextContent('70%');
    expect(printableSummary).toHaveTextContent('Policy Brief Presentation');
    expect(printableSummary).toHaveTextContent('30%');

    // AI allowability and authenticity notes
    expect(printableSummary).toHaveTextContent(/Limited use of AI tools is permitted for brainstorming/);
    expect(printableSummary).toHaveTextContent(/Students must demonstrate independent critical analysis/);

    // Rationale and governance
    expect(printableSummary).toHaveTextContent(/The assessment strategy is designed to develop and evaluate/);
    expect(printableSummary).toHaveTextContent(/Potential over-reliance on AI tools/);
  });
});
