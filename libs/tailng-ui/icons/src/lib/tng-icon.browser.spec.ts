import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { createTngIconPack, provideTngIcons } from './icons';
import { TngIcon } from './tng-icon';

const browserPack = createTngIconPack('browser', {
  shield: '<svg viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3 9 8 11 5-2 8-6 8-11V5z"/></svg>',
});

@Component({
  imports: [TngIcon],
  template: `<tng-icon icon="shield" label="Security" />`,
})
class TrustedTypesHostComponent {}

describe('tng-icon browser security contract', () => {
  it('renders while ordinary-string innerHTML assignments are blocked', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    expect(descriptor).toBeDefined();

    Object.defineProperty(Element.prototype, 'innerHTML', {
      configurable: true,
      get: descriptor?.get,
      set: (): never => {
        throw new TypeError('This document requires TrustedHTML assignment.');
      },
    });

    try {
      const fixture = TestBed.configureTestingModule({
        imports: [TrustedTypesHostComponent],
        providers: [
          provideTngIcons({
            defaultPack: 'browser',
            packs: [browserPack],
          }),
        ],
      }).createComponent(TrustedTypesHostComponent);

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.tng-icon__svg');
      const svg = container?.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg?.namespaceURI).toBe('http://www.w3.org/2000/svg');
      expect(container?.getAttribute('aria-label')).toBe('Security');
    } finally {
      if (descriptor !== undefined) {
        Object.defineProperty(Element.prototype, 'innerHTML', descriptor);
      }
    }
  });
});
