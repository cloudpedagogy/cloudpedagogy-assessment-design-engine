import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { StoreProvider, useStore, STORAGE_KEY, STORAGE_BACKUP_KEY, demoState } from '../store';
import { validateImportJSON } from '../utils/validation';

describe('Blob-based JSON Export and Recovery Safeguards', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('exports state via Blob and Object URL, preserving all fields and revoking URL', async () => {
    let createdBlob: Blob | null = null;
    const mockUrl = 'blob:http://localhost:3000/mock-uuid';

    const createObjectURLSpy = vi.fn().mockImplementation((blob: Blob) => {
      createdBlob = blob;
      return mockUrl;
    });
    const revokeObjectURLSpy = vi.fn();

    vi.stubGlobal('URL', {
      ...globalThis.URL,
      createObjectURL: createObjectURLSpy,
      revokeObjectURL: revokeObjectURLSpy
    });

    const clickSpy = vi.fn();
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    // Spy on createElement to catch anchor click
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === 'a') {
        el.click = clickSpy;
      }
      return el;
    });

    const { result } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>
    });

    act(() => {
      result.current.loadDemoData();
    });

    act(() => {
      result.current.exportJSON();
    });

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(createdBlob).not.toBeNull();

    // Verify blob content
    if (createdBlob) {
      const text = await (createdBlob as Blob).text();
      const parsed = JSON.parse(text);
      expect(parsed.meta.programmeName).toBe(demoState.meta.programmeName);
      expect(parsed.assessments).toHaveLength(demoState.assessments.length);
      expect(parsed.rationale.designRationale).toBe(demoState.rationale.designRationale);

      // Verify compatibility with Batch 1 import validation
      const validationResult = validateImportJSON(parsed);
      expect(validationResult.success).toBe(true);
    }

    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it('safeguards against repeated recovery attempts destroying the only corrupted backup', () => {
    const originalCorrupted = '{"broken": json-without-quotes';
    // Initial corrupted state
    localStorage.setItem(STORAGE_KEY, originalCorrupted);

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // First mount: creates backup
    const { unmount } = renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>
    });

    expect(localStorage.getItem(STORAGE_BACKUP_KEY)).toBe(originalCorrupted);

    unmount();

    // Now simulate another corrupted payload or empty string in STORAGE_KEY
    localStorage.setItem(STORAGE_KEY, '{"another": corrupt');

    // Second mount: must NOT overwrite original backup
    renderHook(() => useStore(), {
      wrapper: ({ children }) => <StoreProvider>{children}</StoreProvider>
    });

    // The FIRST original backup must be retained
    expect(localStorage.getItem(STORAGE_BACKUP_KEY)).toBe(originalCorrupted);

    warnSpy.mockRestore();
  });
});
