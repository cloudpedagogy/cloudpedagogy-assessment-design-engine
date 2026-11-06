import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { demoState, STORAGE_KEY } from '../store';

describe('Accessibility (a11y) Conformance', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoState));
  });

  it('associates context labels with form inputs via htmlFor and id', () => {
    render(<App />);

    expect(screen.getByLabelText(/Programme \/ Degree Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Module \/ Unit Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Academic Level/i)).toBeInTheDocument();
  });

  it('provides accessible labels for learning outcome inputs and buttons', () => {
    render(<App />);

    expect(screen.getByLabelText(/^Outcome Code$/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Outcome Description$/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add learning outcome/i })).toBeInTheDocument();

    const removeOutcomeButtons = screen.getAllByRole('button', { name: /Remove outcome/i });
    expect(removeOutcomeButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('associates assessment editor form labels with inputs', () => {
    render(<App />);

    // Query inputs by their associated label text
    const titles = screen.getAllByLabelText(/^Title$/i);
    expect(titles.length).toBeGreaterThanOrEqual(1);

    const weights = screen.getAllByLabelText(/^Weighting \(%\)$/i);
    expect(weights.length).toBeGreaterThanOrEqual(1);

    const types = screen.getAllByLabelText(/^Type$/i);
    expect(types.length).toBeGreaterThanOrEqual(1);

    const descriptions = screen.getAllByLabelText(/^Description & Task Details$/i);
    expect(descriptions.length).toBeGreaterThanOrEqual(1);

    const aiModes = screen.getAllByLabelText(/^AI Usage Allowability$/i);
    expect(aiModes.length).toBeGreaterThanOrEqual(1);

    const deleteButtons = screen.getAllByRole('button', { name: /Delete assessment/i });
    expect(deleteButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('associates rationale and governance labels with textareas', () => {
    render(<App />);

    expect(screen.getByLabelText(/Design Rationale/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Authenticity Considerations/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Risks or Concerns/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/AI Involvement \(Overall\)/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/^Assumptions$/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByLabelText(/Capability Notes/i)).toBeInTheDocument();
  });

  it('provides accessible names for all header action buttons', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: /Load Demo Example/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Import Assessment Plan from JSON/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export Assessment Plan to JSON/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Entire Workspace/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Print or save assessment plan as PDF/i })).toBeInTheDocument();
  });

  it('announces weighting status changes via aria-live container', () => {
    const { container } = render(<App />);

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
    expect(liveRegion).toHaveTextContent(/Total Weighting: 100%/i);
  });
});
