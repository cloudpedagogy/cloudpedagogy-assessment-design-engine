import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';

const ThrowingComponent = () => {
  throw new Error('Test crash in child component');
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('catches render errors and displays recovery UI without deleting storage', () => {
    // Suppress console.error during expected throw
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    localStorage.setItem('cloudpedagogy_assessment_engine', 'preserved-data');

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Application Error')).toBeInTheDocument();
    expect(screen.getByText(/Test crash in child component/)).toBeInTheDocument();
    expect(screen.getByText(/Your existing assessment data in local storage has/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Application/i })).toBeInTheDocument();

    // Verify localStorage was NOT deleted or overwritten
    expect(localStorage.getItem('cloudpedagogy_assessment_engine')).toBe('preserved-data');

    spy.mockRestore();
  });
});
