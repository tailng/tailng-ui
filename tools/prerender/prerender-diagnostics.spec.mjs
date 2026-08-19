import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isKnownNonFatalBrowserError } from './prerender-diagnostics.mjs';

describe('isKnownNonFatalBrowserError', () => {
  it('recognizes standardized ResizeObserver delivery errors', () => {
    assert.equal(
      isKnownNonFatalBrowserError(
        'ERROR Error: ResizeObserver loop completed with undelivered notifications.',
      ),
      true,
    );
    assert.equal(isKnownNonFatalBrowserError('ResizeObserver loop limit exceeded'), true);
  });

  it('keeps other browser and application errors fatal', () => {
    assert.equal(
      isKnownNonFatalBrowserError('ERROR TypeError: Cannot read properties of null'),
      false,
    );
    assert.equal(isKnownNonFatalBrowserError('ERROR Error: ResizeObserver callback failed'), false);
  });
});
