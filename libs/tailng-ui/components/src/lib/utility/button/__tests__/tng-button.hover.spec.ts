import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import {
  type TngButtonAppearance,
  TngButtonComponent,
  type TngButtonTone,
} from '../tng-button.component';

function getInnerButton(fixture: ComponentFixture<unknown>): HTMLButtonElement {
  const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement | null;
  if (!btn) throw new Error('Expected <button> to exist in the DOM');
  return btn;
}

describe('tng-button hover styles — data attribute contract', () => {
  afterEach(() => TestBed.resetTestingModule());

  // ---------------------------------------------------------------------------
  // data-appearance
  // ---------------------------------------------------------------------------
  describe('data-appearance attribute', () => {
    it.each<TngButtonAppearance>(['solid', 'outline', 'ghost'])(
      'sets data-appearance="%s"',
      async (appearance) => {
        @Component({
          imports: [TngButtonComponent],
          template: `<tng-button [appearance]="appearance">Click</tng-button>`,
        })
        class Harness {
          public appearance: TngButtonAppearance = appearance;
        }

        const fixture = TestBed.configureTestingModule({ imports: [Harness] }).createComponent(Harness);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(getInnerButton(fixture).getAttribute('data-appearance')).toBe(appearance);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // data-tone
  // ---------------------------------------------------------------------------
  describe('data-tone attribute', () => {
    it.each<TngButtonTone>(['primary', 'danger', 'success', 'neutral'])(
      'sets data-tone="%s"',
      async (tone) => {
        @Component({
          imports: [TngButtonComponent],
          template: `<tng-button [tone]="tone">Click</tng-button>`,
        })
        class Harness {
          public tone: TngButtonTone = tone;
        }

        const fixture = TestBed.configureTestingModule({ imports: [Harness] }).createComponent(Harness);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(getInnerButton(fixture).getAttribute('data-tone')).toBe(tone);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // Hover guard — disabled state
  // The CSS hover rules use :not(:disabled):not([data-disabled]).
  // A disabled button must carry the native `disabled` attribute so the
  // browser's :disabled pseudo-class matches and hover is suppressed.
  // ---------------------------------------------------------------------------
  describe('hover guard — disabled state', () => {
    it('sets native disabled attribute when disabled=true', async () => {
      @Component({
        imports: [TngButtonComponent],
        template: `<tng-button [disabled]="true">Click</tng-button>`,
      })
      class Harness {}

      const fixture = TestBed.configureTestingModule({ imports: [Harness] }).createComponent(Harness);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getInnerButton(fixture).disabled).toBe(true);
    });

    it('does not set disabled attribute when disabled=false', async () => {
      @Component({
        imports: [TngButtonComponent],
        template: `<tng-button [disabled]="false">Click</tng-button>`,
      })
      class Harness {}

      const fixture = TestBed.configureTestingModule({ imports: [Harness] }).createComponent(Harness);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getInnerButton(fixture).disabled).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Hover selector coverage — each appearance+tone combination
  // Verifies both data attributes are present together so the compound CSS
  // selector (.tng-button[data-appearance='x'][data-tone='y']:hover) matches.
  // ---------------------------------------------------------------------------
  describe('hover selector coverage per variant', () => {
    const solidTones: TngButtonTone[] = ['primary', 'danger', 'success', 'neutral'];

    it.each(solidTones)(
      'solid + %s: both data-appearance and data-tone are present and button is enabled',
      async (tone) => {
        @Component({
          imports: [TngButtonComponent],
          template: `<tng-button appearance="solid" [tone]="tone">Click</tng-button>`,
        })
        class Harness {
          public tone: TngButtonTone = tone;
        }

        const fixture = TestBed.configureTestingModule({ imports: [Harness] }).createComponent(Harness);
        fixture.detectChanges();
        await fixture.whenStable();

        const btn = getInnerButton(fixture);
        expect(btn.getAttribute('data-appearance')).toBe('solid');
        expect(btn.getAttribute('data-tone')).toBe(tone);
        expect(btn.disabled).toBe(false);
      },
    );

    it.each<TngButtonAppearance>(['outline', 'ghost'])(
      '%s: data-appearance is present and button is enabled',
      async (appearance) => {
        @Component({
          imports: [TngButtonComponent],
          template: `<tng-button [appearance]="appearance">Click</tng-button>`,
        })
        class Harness {
          public appearance: TngButtonAppearance = appearance;
        }

        const fixture = TestBed.configureTestingModule({ imports: [Harness] }).createComponent(Harness);
        fixture.detectChanges();
        await fixture.whenStable();

        const btn = getInnerButton(fixture);
        expect(btn.getAttribute('data-appearance')).toBe(appearance);
        expect(btn.disabled).toBe(false);
      },
    );
  });

  // ---------------------------------------------------------------------------
  // Disabled variants must not satisfy the hover selector
  // ---------------------------------------------------------------------------
  describe('disabled button is ineligible for hover', () => {
    it.each<[TngButtonAppearance, TngButtonTone]>([
      ['solid', 'primary'],
      ['solid', 'danger'],
      ['solid', 'success'],
      ['solid', 'neutral'],
      ['outline', 'primary'],
      ['ghost', 'primary'],
    ])('%s + %s disabled button has native disabled=true', async (appearance, tone) => {
      @Component({
        imports: [TngButtonComponent],
        template: `<tng-button [appearance]="appearance" [tone]="tone" [disabled]="true">Click</tng-button>`,
      })
      class Harness {
        public appearance: TngButtonAppearance = appearance;
        public tone: TngButtonTone = tone;
      }

      const fixture = TestBed.configureTestingModule({ imports: [Harness] }).createComponent(Harness);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getInnerButton(fixture).disabled).toBe(true);
    });
  });
});
