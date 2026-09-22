import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { fSuppressDevWarnings } from '@foblex/flow';
import { afterEach } from 'vitest';
import 'zone.js';
import 'zone.js/testing';

class TngTestResizeObserver implements ResizeObserver {
  public constructor(private readonly callback: ResizeObserverCallback) {}

  public disconnect(): void {
    // ResizeObserver cleanup is intentionally a no-op in jsdom.
  }

  public observe(target: Element): void {
    this.callback(
      [
        {
          target,
          contentRect: target.getBoundingClientRect(),
        } as ResizeObserverEntry,
      ],
      this,
    );
  }

  public unobserve(): void {
    // Individual targets do not need tracking in this test double.
  }
}

globalThis.ResizeObserver ??= TngTestResizeObserver;

fSuppressDevWarnings(true);

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

afterEach(() => {
  getTestBed().resetTestingModule();
});
