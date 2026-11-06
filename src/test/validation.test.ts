import { describe, it, expect } from 'vitest';
import { normalizeState, validateImportJSON, normalizeWeighting } from '../utils/validation';

describe('normalizeWeighting', () => {
  it('handles valid numbers', () => {
    expect(normalizeWeighting(50)).toBe(50);
    expect(normalizeWeighting(0)).toBe(0);
  });

  it('coerces valid numeric strings', () => {
    expect(normalizeWeighting('30')).toBe(30);
    expect(normalizeWeighting('12.5')).toBe(12.5);
  });

  it('safely falls back to 0 for invalid inputs', () => {
    expect(normalizeWeighting(NaN)).toBe(0);
    expect(normalizeWeighting('invalid')).toBe(0);
    expect(normalizeWeighting(null)).toBe(0);
    expect(normalizeWeighting(undefined)).toBe(0);
  });
});

describe('normalizeState', () => {
  it('returns safe default state for non-record inputs', () => {
    const fromNull = normalizeState(null);
    expect(fromNull.assessments).toEqual([]);
    expect(fromNull.learningOutcomes).toEqual([]);
    expect(fromNull.meta.programmeName).toBe('');

    const fromString = normalizeState('corrupted string');
    expect(fromString.assessments).toEqual([]);
  });

  it('recovers partial state with missing collections', () => {
    const partial = {
      meta: { programmeName: 'BSc Computer Science' },
      // assessments and learningOutcomes are omitted
      rationale: { designRationale: 'Test rationale' }
    };
    const normalized = normalizeState(partial);
    expect(normalized.meta.programmeName).toBe('BSc Computer Science');
    expect(normalized.meta.moduleName).toBe('');
    expect(normalized.assessments).toEqual([]);
    expect(normalized.learningOutcomes).toEqual([]);
    expect(normalized.rationale.designRationale).toBe('Test rationale');
    expect(normalized.rationale.authenticityConsiderations).toBe('');
    expect(normalized.rationale.risksOrConcerns).toBe('');
  });

  it('preserves valid assessments and normalizes weighting strings', () => {
    const raw = {
      assessments: [
        {
          id: 'A1',
          title: 'Essay 1',
          description: 'A critical essay',
          type: 'Essay',
          weighting: '40', // string to coerce
          linkedOutcomeIds: ['LO1'],
          aiUsageMode: 'conditional',
          aiUsageDescription: 'Brainstorming only',
          authenticityNotes: 'Independent work',
          capabilityNotes: 'Notes'
        }
      ]
    };
    const normalized = normalizeState(raw);
    expect(normalized.assessments).toHaveLength(1);
    expect(normalized.assessments[0].weighting).toBe(40);
    expect(normalized.assessments[0].linkedOutcomeIds).toEqual(['LO1']);
  });

  it('preserves governance fields when present', () => {
    const raw = {
      rationale: {
        designRationale: 'Rationale text',
        authenticityConsiderations: 'Authentic task',
        risksOrConcerns: 'Low risk',
        aiInvolvement: 'Drafting prompts',
        assumptions: 'Students have laptops',
        capabilityNotes: 'Phase 4 alignment'
      }
    };
    const normalized = normalizeState(raw);
    expect(normalized.rationale.capabilityNotes).toBe('Phase 4 alignment');
    expect(normalized.rationale.aiInvolvement).toBe('Drafting prompts');
    expect(normalized.rationale.assumptions).toBe('Students have laptops');
  });
});

describe('validateImportJSON', () => {
  it('rejects non-object inputs', () => {
    const res = validateImportJSON('string');
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('valid JSON object');
    }
  });

  it('rejects foreign JSON without recognized keys', () => {
    const res = validateImportJSON({ foo: 'bar', timestamp: 12345 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('Unrecognized file structure');
    }
  });

  it('rejects when assessments is not an array', () => {
    const res = validateImportJSON({ assessments: 'none', meta: {} });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain("'assessments' field must be an array");
    }
  });

  it('rejects when learningOutcomes is not an array', () => {
    const res = validateImportJSON({ learningOutcomes: 123 });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain("'learningOutcomes' field must be an array");
    }
  });

  it('rejects when assessments array contains non-objects', () => {
    const res = validateImportJSON({ assessments: [null, 'invalid'] });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('Invalid assessment record at index 0');
    }
  });

  it('accepts valid full export file', () => {
    const valid = {
      meta: {
        programmeName: 'MSc Data Science',
        moduleName: 'Machine Learning',
        level: 'Postgraduate'
      },
      learningOutcomes: [
        { id: 'LO1', code: 'LO1', description: 'Train ML models' }
      ],
      assessments: [
        {
          id: 'A1',
          title: 'ML Project',
          description: 'Implement classifier',
          type: 'Project',
          weighting: 100,
          linkedOutcomeIds: ['LO1'],
          aiUsageMode: 'allowed',
          aiUsageDescription: 'Permitted',
          authenticityNotes: 'Github code'
        }
      ],
      rationale: {
        designRationale: 'Hands-on practice',
        authenticityConsiderations: 'Real datasets',
        risksOrConcerns: 'Plagiarism'
      },
      lastUpdated: '2026-04-20T10:00:00.000Z'
    };
    const res = validateImportJSON(valid);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.meta.programmeName).toBe('MSc Data Science');
      expect(res.data.assessments).toHaveLength(1);
      expect(res.data.assessments[0].title).toBe('ML Project');
      expect(res.data.learningOutcomes).toHaveLength(1);
    }
  });
});
