import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// Mock global objects for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

/**
 * Silence jsdom CSS parser noise from modern CSS (e.g. @layer) used by libs like @ng-icons/core.
 * jsdom sometimes passes (Error, details) across multiple console.error args.
 */
const originalConsoleError = console.error.bind(console);

const isCssParseNoise = (args: unknown[]): boolean => {
  for (const a of args) {
    // string arg
    if (typeof a === 'string' && /Could not parse CSS stylesheet/i.test(a)) return true;

    // Error arg
    if (a instanceof Error && /Could not parse CSS stylesheet/i.test(a.message)) return true;

    // Some libs pass an object with "detail" or "type"
    if (a && typeof a === 'object') {
      const anyObj = a as any;
      const detail = typeof anyObj.detail === 'string' ? anyObj.detail : '';
      const type = typeof anyObj.type === 'string' ? anyObj.type : '';
      const message = typeof anyObj.message === 'string' ? anyObj.message : '';

      // jsdom uses type: 'css parsing' and detail contains the CSS
      if (/css parsing/i.test(type) && detail.includes('@layer ng-icon')) return true;
      if (/Could not parse CSS stylesheet/i.test(message)) return true;
    }
  }
  return false;
};

console.error = (...args: unknown[]) => {
  if (isCssParseNoise(args)) return;
  originalConsoleError(...(args as unknown as Parameters<typeof originalConsoleError>));
};