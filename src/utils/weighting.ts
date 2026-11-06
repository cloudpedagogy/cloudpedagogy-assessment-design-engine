/**
 * Assessment weighting calculations, formatting, and validation utilities.
 * Ensures consistent math across editor panels and printable outputs,
 * preventing NaN/negative/Infinity values and floating-point false negatives.
 */

/**
 * Sanitizes user input for weighting fields.
 * Prevents NaN, Infinity, and negative numbers from entering state.
 * Empty or whitespace input defaults to 0.
 */
export function sanitizeWeightInput(val: string | number): number {
  if (typeof val === 'number') {
    if (isNaN(val) || !isFinite(val) || val < 0) return 0;
    return val;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '') return 0;
    const parsed = Number(trimmed);
    if (isNaN(parsed) || !isFinite(parsed) || parsed < 0) return 0;
    return parsed;
  }
  return 0;
}

/**
 * Calculates the total sum of assessment weightings.
 * Safeguards against non-finite or negative values.
 */
export function calculateTotalWeighting(assessments: Array<{ weighting?: number }>): number {
  return assessments.reduce((sum, a) => {
    const w = typeof a.weighting === 'number' && isFinite(a.weighting) && a.weighting >= 0 ? a.weighting : 0;
    return sum + w;
  }, 0);
}

/**
 * Checks whether the total weighting equals 100%.
 * Employs an epsilon tolerance (0.0001) to eliminate floating-point precision false negatives
 * (e.g. 33.33 + 33.33 + 33.34 = 100.00000000000001) while strictly rejecting incomplete designs.
 */
export function isTotalWeightingValid(total: number): boolean {
  return Math.abs(total - 100) < 0.0001;
}

/**
 * Formats a weighting number for human-readable display.
 * Avoids displaying floating-point artifacts like 100.00000000000001.
 * Preserves genuine fractional decimals up to 2 decimal places.
 */
export function formatWeighting(val: number): string {
  if (!isFinite(val) || isNaN(val)) return '0';
  // If value is within epsilon of an integer, display integer
  if (Math.abs(val - Math.round(val)) < 0.0001) {
    return Math.round(val).toString();
  }
  // Otherwise round to 2 decimal places and strip trailing zeros
  const rounded = Number(val.toFixed(2));
  return rounded.toString();
}
