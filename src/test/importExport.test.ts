import { describe, it, expect } from 'vitest';
import { validateImportJSON } from '../utils/validation';
import { demoState } from '../store';

describe('Import and Export Round Trips & Validation', () => {
  it('successfully round-trips demoState through JSON serialization and validation', () => {
    const serialized = JSON.stringify(demoState);
    const parsed = JSON.parse(serialized);

    const result = validateImportJSON(parsed);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.meta.programmeName).toBe(demoState.meta.programmeName);
      expect(result.data.assessments).toHaveLength(demoState.assessments.length);
      expect(result.data.learningOutcomes).toHaveLength(demoState.learningOutcomes.length);
      expect(result.data.rationale.designRationale).toBe(demoState.rationale.designRationale);
    }
  });

  it('preserves all existing governance fields in an export/import round-trip', () => {
    const customWithGovernance = {
      ...demoState,
      rationale: {
        ...demoState.rationale,
        capabilityNotes: 'Level 5 Capability alignment',
        aiInvolvement: 'Used AI for rubric drafting',
        assumptions: 'Students have institutional accounts'
      }
    };

    const serialized = JSON.stringify(customWithGovernance);
    const parsed = JSON.parse(serialized);
    const result = validateImportJSON(parsed);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rationale.capabilityNotes).toBe('Level 5 Capability alignment');
      expect(result.data.rationale.aiInvolvement).toBe('Used AI for rubric drafting');
      expect(result.data.rationale.assumptions).toBe('Students have institutional accounts');
    }
  });

  it('rejects malformed import files without modifying state', () => {
    const invalidInputs = [
      null,
      12345,
      'a plain string',
      [],
      {}, // missing recognized domain collections
      { randomKey: 'randomValue' },
      { assessments: 'not-an-array' },
      { learningOutcomes: 'not-an-array' },
      { assessments: [null] },
      { learningOutcomes: ['just-a-string'] }
    ];

    for (const input of invalidInputs) {
      const result = validateImportJSON(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeTruthy();
      }
    }
  });

  it('handles safely recoverable historical structures without throwing', () => {
    // Older structure missing capabilityNotes, submissionMode, feedbackApproach
    const legacyState = {
      meta: {
        programmeName: 'BA History'
      },
      learningOutcomes: [
        { id: 'lo-1', description: 'Analyze primary sources' }
      ],
      assessments: [
        {
          id: 'ass-1',
          title: 'Document Analysis',
          description: 'Primary source evaluation',
          type: 'Report',
          weighting: 50,
          linkedOutcomeIds: ['lo-1'],
          aiUsageMode: 'conditional',
          aiUsageDescription: 'Only for language polish',
          authenticityNotes: 'Historical archive materials'
        }
      ],
      rationale: {
        designRationale: 'Historical methodology',
        authenticityConsiderations: 'Real archives',
        risksOrConcerns: 'AI translation artifacts'
      }
    };

    const result = validateImportJSON(legacyState);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.programmeName).toBe('BA History');
      expect(result.data.assessments[0].title).toBe('Document Analysis');
      expect(result.data.assessments[0].weighting).toBe(50);
      expect(result.data.learningOutcomes[0].id).toBe('lo-1');
      // Normalized defaults are safely provided
      expect(result.data.meta.moduleName).toBe('');
      expect(result.data.rationale.capabilityNotes).toBeUndefined();
    }
  });
});
