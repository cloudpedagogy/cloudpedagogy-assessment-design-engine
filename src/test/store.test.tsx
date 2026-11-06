import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { StoreProvider, useStore, STORAGE_KEY, STORAGE_BACKUP_KEY, demoState } from '../store';

describe('Store and Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with emptyState when storage is empty', () => {
    const { result } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>
    });

    expect(result.current.state.assessments).toEqual([]);
    expect(result.current.state.learningOutcomes).toEqual([]);
    expect(result.current.state.meta.programmeName).toBe('');
  });

  it('restores valid saved state from localStorage', () => {
    const savedData = {
      meta: { programmeName: 'BSc Architecture', moduleName: 'Design Studio 1', level: 'Year 1' },
      learningOutcomes: [{ id: 'LO1', code: 'LO1', description: 'Draft architectural plans' }],
      assessments: [
        {
          id: 'A1',
          title: 'Portfolio 1',
          description: 'Drawings',
          type: 'Portfolio',
          weighting: 100,
          linkedOutcomeIds: ['LO1'],
          aiUsageMode: 'not_allowed',
          aiUsageDescription: 'Manual work only',
          authenticityNotes: 'Studio verified'
        }
      ],
      rationale: {
        designRationale: 'Hands-on drafting',
        authenticityConsiderations: 'Studio presence',
        risksOrConcerns: 'None'
      },
      lastUpdated: '2026-05-01T00:00:00.000Z'
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));

    const { result } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>
    });

    expect(result.current.state.meta.programmeName).toBe('BSc Architecture');
    expect(result.current.state.assessments).toHaveLength(1);
    expect(result.current.state.assessments[0].title).toBe('Portfolio 1');
  });

  it('non-destructively handles corrupted JSON in localStorage without throwing or wiping it on mount', () => {
    const corruptedString = '{"unclosed-json';
    localStorage.setItem(STORAGE_KEY, corruptedString);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>
    });

    // Fallback safe state is provided to prevent crash
    expect(result.current.state.assessments).toEqual([]);

    // The original corrupted data must NOT have been silently overwritten in localStorage on mount
    expect(localStorage.getItem(STORAGE_KEY)).toBe(corruptedString);
    // Also backup was created
    expect(localStorage.getItem(STORAGE_BACKUP_KEY)).toBe(corruptedString);

    warnSpy.mockRestore();
  });

  it('adds, updates, and removes learning outcomes with cascading unlinking in assessments', () => {
    const { result } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>
    });

    // Add outcome
    act(() => {
      result.current.addLearningOutcome({ code: 'LO1', description: 'Analyze systems' });
    });
    expect(result.current.state.learningOutcomes).toHaveLength(1);
    const outcomeId = result.current.state.learningOutcomes[0].id;

    // Add assessment and link outcome
    act(() => {
      result.current.addAssessment();
    });
    const assessmentId = result.current.state.assessments[0].id;

    act(() => {
      result.current.updateAssessment(assessmentId, {
        title: 'Midterm Case Study',
        linkedOutcomeIds: [outcomeId]
      });
    });
    expect(result.current.state.assessments[0].linkedOutcomeIds).toContain(outcomeId);

    // Update outcome
    act(() => {
      result.current.updateLearningOutcome(outcomeId, { description: 'Critically analyze systems' });
    });
    expect(result.current.state.learningOutcomes[0].description).toBe('Critically analyze systems');

    // Remove outcome -> must unlink from assessment
    act(() => {
      result.current.removeLearningOutcome(outcomeId);
    });
    expect(result.current.state.learningOutcomes).toHaveLength(0);
    expect(result.current.state.assessments[0].linkedOutcomeIds).not.toContain(outcomeId);
  });

  it('loads demo data and updates persistence', () => {
    const { result } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>
    });

    act(() => {
      result.current.loadDemoData();
    });

    expect(result.current.state.meta.programmeName).toBe(demoState.meta.programmeName);
    expect(result.current.state.assessments).toHaveLength(demoState.assessments.length);

    // Check localStorage was updated after mutation
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(stored.meta.programmeName).toBe(demoState.meta.programmeName);
  });

  it('clears workspace when resetState is confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const { result } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>
    });

    act(() => {
      result.current.loadDemoData();
    });
    expect(result.current.state.assessments.length).toBeGreaterThan(0);

    act(() => {
      result.current.resetState();
    });
    expect(result.current.state.assessments).toHaveLength(0);
    expect(result.current.state.learningOutcomes).toHaveLength(0);
  });
});
