import { describe, it, expect } from 'vitest';
import {
  sanitizeWeightInput,
  calculateTotalWeighting,
  isTotalWeightingValid,
  formatWeighting
} from '../utils/weighting';

describe('Assessment Weighting Utilities', () => {
  describe('sanitizeWeightInput', () => {
    it('accepts valid integers and positive numbers', () => {
      expect(sanitizeWeightInput(50)).toBe(50);
      expect(sanitizeWeightInput(0)).toBe(0);
      expect(sanitizeWeightInput(100)).toBe(100);
      expect(sanitizeWeightInput(33.33)).toBe(33.33);
    });

    it('sanitizes valid numeric strings', () => {
      expect(sanitizeWeightInput('40')).toBe(40);
      expect(sanitizeWeightInput(' 25.5 ')).toBe(25.5);
    });

    it('rejects negative numbers and clamps them to 0', () => {
      expect(sanitizeWeightInput(-15)).toBe(0);
      expect(sanitizeWeightInput('-50')).toBe(0);
    });

    it('rejects NaN, Infinity, -Infinity and invalid strings', () => {
      expect(sanitizeWeightInput(NaN)).toBe(0);
      expect(sanitizeWeightInput(Infinity)).toBe(0);
      expect(sanitizeWeightInput(-Infinity)).toBe(0);
      expect(sanitizeWeightInput('abc')).toBe(0);
      expect(sanitizeWeightInput('')).toBe(0);
      expect(sanitizeWeightInput('   ')).toBe(0);
    });
  });

  describe('calculateTotalWeighting', () => {
    it('calculates sum of valid integer assessments', () => {
      const assessments = [{ weighting: 40 }, { weighting: 60 }];
      expect(calculateTotalWeighting(assessments)).toBe(100);
    });

    it('handles empty assessments array (0% total)', () => {
      expect(calculateTotalWeighting([])).toBe(0);
    });

    it('handles fractional weightings accurately', () => {
      const assessments = [
        { weighting: 33.33 },
        { weighting: 33.33 },
        { weighting: 33.34 }
      ];
      const sum = calculateTotalWeighting(assessments);
      // Floating-point math in JS results in 100.00000000000001
      expect(isTotalWeightingValid(sum)).toBe(true);
    });

    it('safeguards against missing or invalid weightings in items', () => {
      const assessments = [
        { weighting: 50 },
        { weighting: undefined },
        { weighting: NaN },
        { weighting: -20 },
        { weighting: 50 }
      ];
      expect(calculateTotalWeighting(assessments)).toBe(100);
    });
  });

  describe('isTotalWeightingValid', () => {
    it('returns true for exact 100%', () => {
      expect(isTotalWeightingValid(100)).toBe(true);
    });

    it('returns true for fractional sum within epsilon (33.33 + 33.33 + 33.34)', () => {
      const fractionalTotal = 33.33 + 33.33 + 33.34; // 100.00000000000001
      expect(isTotalWeightingValid(fractionalTotal)).toBe(true);
    });

    it('returns false for incomplete designs (< 100%)', () => {
      expect(isTotalWeightingValid(0)).toBe(false);
      expect(isTotalWeightingValid(75)).toBe(false);
      expect(isTotalWeightingValid(99.9)).toBe(false);
    });

    it('returns false for over-weight designs (> 100%)', () => {
      expect(isTotalWeightingValid(100.5)).toBe(false);
      expect(isTotalWeightingValid(120)).toBe(false);
    });
  });

  describe('formatWeighting', () => {
    it('formats exact integers cleanly without decimals', () => {
      expect(formatWeighting(100)).toBe('100');
      expect(formatWeighting(0)).toBe('0');
      expect(formatWeighting(50)).toBe('50');
    });

    it('formats near-integer floating point sums without ugly float artifacts', () => {
      const nearHundred = 33.33 + 33.33 + 33.34;
      expect(formatWeighting(nearHundred)).toBe('100');
    });

    it('preserves legitimate fractional decimals', () => {
      expect(formatWeighting(12.5)).toBe('12.5');
      expect(formatWeighting(33.33)).toBe('33.33');
    });

    it('safely handles non-finite inputs', () => {
      expect(formatWeighting(NaN)).toBe('0');
      expect(formatWeighting(Infinity)).toBe('0');
    });
  });
});

