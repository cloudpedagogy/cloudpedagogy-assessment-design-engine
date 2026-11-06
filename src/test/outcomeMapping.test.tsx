import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { StoreProvider, useStore } from '../store';
import { normalizeState } from '../utils/validation';

describe('Learning Outcome Mapping Integrity', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('safely cascades outcome deletion by removing references from assessments', () => {
    const { result } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>
    });

    act(() => {
      result.current.addLearningOutcome({ code: 'LO1', description: 'Outcome 1' });
      result.current.addLearningOutcome({ code: 'LO2', description: 'Outcome 2' });
      result.current.addAssessment();
    });

    const lo1Id = result.current.state.learningOutcomes[0].id;
    const lo2Id = result.current.state.learningOutcomes[1].id;
    const assessmentId = result.current.state.assessments[0].id;

    // Link both outcomes
    act(() => {
      result.current.updateAssessment(assessmentId, {
        linkedOutcomeIds: [lo1Id, lo2Id]
      });
    });

    expect(result.current.state.assessments[0].linkedOutcomeIds).toEqual([lo1Id, lo2Id]);

    // Delete LO1 -> LO2 must remain linked
    act(() => {
      result.current.removeLearningOutcome(lo1Id);
    });

    expect(result.current.state.learningOutcomes).toHaveLength(1);
    expect(result.current.state.learningOutcomes[0].id).toBe(lo2Id);
    expect(result.current.state.assessments[0].linkedOutcomeIds).toEqual([lo2Id]);
  });

  it('preserves existing valid mappings during other state updates', () => {
    const { result } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>
    });

    act(() => {
      result.current.addLearningOutcome({ code: 'LO1', description: 'Outcome 1' });
      result.current.addAssessment();
    });

    const loId = result.current.state.learningOutcomes[0].id;
    const assessmentId = result.current.state.assessments[0].id;

    act(() => {
      result.current.updateAssessment(assessmentId, {
        linkedOutcomeIds: [loId],
        title: 'Initial Title'
      });
    });

    // Update title and description; outcome mappings must stay intact
    act(() => {
      result.current.updateAssessment(assessmentId, {
        title: 'Updated Title',
        description: 'Updated Description'
      });
    });

    expect(result.current.state.assessments[0].linkedOutcomeIds).toEqual([loId]);
  });

  it('preserves orphaned outcome references without crashing during recovery', () => {
    // Assessment references an outcome that is not present in learningOutcomes
    const rawWithOrphan = {
      learningOutcomes: [
        { id: 'lo-existing', code: 'LO1', description: 'Existing LO' }
      ],
      assessments: [
        {
          id: 'a-1',
          title: 'Essay with orphan',
          description: '',
          type: 'Essay',
          weighting: 100,
          linkedOutcomeIds: ['lo-existing', 'lo-orphaned-123'],
          aiUsageMode: 'allowed',
          aiUsageDescription: '',
          authenticityNotes: ''
        }
      ]
    };

    const normalized = normalizeState(rawWithOrphan);
    // User mappings must NOT be silently stripped during recovery
    expect(normalized.assessments[0].linkedOutcomeIds).toContain('lo-existing');
    expect(normalized.assessments[0].linkedOutcomeIds).toContain('lo-orphaned-123');
  });
});
