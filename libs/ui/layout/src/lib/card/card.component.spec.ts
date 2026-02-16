// card.component.spec.ts
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TngCard } from './card.component';
import { TngCardFooter, TngCardHeader } from './card-slots.directive';

/* ─────────────────────────
 * Helpers
 * ───────────────────────── */
// Root container is tng-card > div
const getContainer = (fix: ComponentFixture<unknown>): HTMLDivElement =>
  fix.debugElement.query(By.css('tng-card > div')).nativeElement as HTMLDivElement;

// Inner sections are tng-card > div > div (header, body, footer)
const getSections = (fix: ComponentFixture<unknown>): HTMLDivElement[] =>
  fix.debugElement.queryAll(By.css('tng-card > div > div')).map((de) => de.nativeElement as HTMLDivElement);

// Body is always present. With header+body+footer: idx 0=header, 1=body, 2=footer
// With body only: idx 0=body. With header+body: idx 0=header, 1=body. With body+footer: idx 0=body, 1=footer
const getBody = (fix: ComponentFixture<unknown>): HTMLDivElement | null => {
  const sections = getSections(fix);
  if (sections.length === 1) return sections[0];
  if (sections.length === 2) {
    // Could be header+body or body+footer; body has px-4 py-4
    const bodyLike = sections.find((s) => s.className.includes('px-4'));
    return bodyLike ?? sections[1];
  }
  if (sections.length === 3) return sections[1];
  return null;
};

/* ─────────────────────────
 * Host components
 * ───────────────────────── */
@Component({
  standalone: true,
  imports: [TngCard, TngCardHeader, TngCardFooter],
  template: `
    <tng-card [slot]="slot">
      @if (hasHeader) {
        <div tngCardHeader>Header</div>
      }
      <p>Body content</p>
      @if (hasFooter) {
        <div tngCardFooter>Footer</div>
      }
    </tng-card>
  `,
})
class BasicHost {
  hasHeader = true;
  hasFooter = true;
  slot: Record<string, string> = {};
}

@Component({
  standalone: true,
  imports: [TngCard],
  template: `
    <tng-card [slot]="slot">
      <p>Body only</p>
    </tng-card>
  `,
})
class BodyOnlyHost {
  slot: Record<string, string> = {};
}

describe('TngCard', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  const setup = async () => {
    await TestBed.configureTestingModule({ imports: [BasicHost] }).compileComponents();
    const fix = TestBed.createComponent(BasicHost);
    return fix;
  };

  const setupBodyOnly = async () => {
    await TestBed.configureTestingModule({ imports: [BodyOnlyHost] }).compileComponents();
    const fix = TestBed.createComponent(BodyOnlyHost);
    return fix;
  };

  describe('Rendering', () => {
    it('renders container element', async () => {
      const fix = await setup();
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container).toBeTruthy();
    });

    it('renders header when tngCardHeader is projected', async () => {
      const fix = await setup();
      fix.componentInstance.hasHeader = true;
      fix.detectChanges();

      const sections = getSections(fix);
      expect(sections.length).toBe(3); // header, body, footer
    });

    it('renders body (default slot)', async () => {
      const fix = await setup();
      fix.detectChanges();

      const body = getBody(fix);
      expect(body).toBeTruthy();
      expect(body?.textContent?.trim()).toContain('Body content');
    });

    it('renders footer when tngCardFooter is projected', async () => {
      const fix = await setup();
      fix.componentInstance.hasFooter = true;
      fix.detectChanges();

      const sections = getSections(fix);
      expect(sections.length).toBe(3);
    });

    it('renders only body when no header/footer', async () => {
      const fix = await setupBodyOnly();
      fix.detectChanges();

      const sections = getSections(fix);
      expect(sections.length).toBe(1);
    });
  });

  describe('Base classes', () => {
    it('applies container base classes', async () => {
      const fix = await setup();
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('block');
      expect(container.className).toContain('rounded-lg');
      expect(container.className).toContain('border');
      expect(container.className).toContain('border-border');
      expect(container.className).toContain('bg-bg');
      expect(container.className).toContain('shadow-sm');
    });

    it('applies header base classes when header exists', async () => {
      const fix = await setup();
      fix.detectChanges();

      const sections = getSections(fix);
      const headerDiv = sections[0];
      expect(headerDiv.className).toContain('border-b');
      expect(headerDiv.className).toContain('px-4');
      expect(headerDiv.className).toContain('py-3');
    });

    it('applies body base classes', async () => {
      const fix = await setup();
      fix.detectChanges();

      const body = getBody(fix);
      expect(body?.className).toContain('px-4');
      expect(body?.className).toContain('py-4');
    });

    it('applies footer base classes when footer exists', async () => {
      const fix = await setup();
      fix.detectChanges();

      const sections = getSections(fix);
      const footerDiv = sections[2];
      expect(footerDiv.className).toContain('border-t');
      expect(footerDiv.className).toContain('px-4');
      expect(footerDiv.className).toContain('py-3');
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { container: 'border-2 border-primary max-w-md' };
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('border-2');
      expect(container.className).toContain('border-primary');
      expect(container.className).toContain('max-w-md');
      expect(container.className).toContain('block');
    });

    it('applies header slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { header: 'bg-primary/10 font-bold' };
      fix.detectChanges();

      const sections = getSections(fix);
      const headerDiv = sections[0];
      expect(headerDiv.className).toContain('bg-primary/10');
      expect(headerDiv.className).toContain('font-bold');
      expect(headerDiv.className).toContain('border-b');
    });

    it('applies body slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { body: 'p-6 space-y-3' };
      fix.detectChanges();

      const body = getBody(fix);
      expect(body?.className).toContain('p-6');
      expect(body?.className).toContain('space-y-3');
      expect(body?.className).toContain('px-4');
    });

    it('applies footer slot classes', async () => {
      const fix = await setup();
      fix.componentInstance.slot = { footer: 'bg-primary/5 text-xs' };
      fix.detectChanges();

      const sections = getSections(fix);
      const footerDiv = sections[2];
      expect(footerDiv.className).toContain('bg-primary/5');
      expect(footerDiv.className).toContain('text-xs');
      expect(footerDiv.className).toContain('border-t');
    });

    it('handles empty slot object', async () => {
      const fix = await setup();
      fix.componentInstance.slot = {};
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('block');
      expect(container.className).toContain('rounded-lg');
    });

    it('applies multiple slots together', async () => {
      const fix = await setup();
      fix.componentInstance.slot = {
        container: 'max-w-sm',
        header: 'bg-primary/10',
        body: 'p-6',
        footer: 'text-sm',
      };
      fix.detectChanges();

      const container = getContainer(fix);
      expect(container.className).toContain('max-w-sm');

      const sections = getSections(fix);
      expect(sections[0].className).toContain('bg-primary/10');
      expect(sections[1].className).toContain('p-6');
      expect(sections[2].className).toContain('text-sm');
    });
  });

  describe('Conditional header/footer', () => {
    it('hides header when no tngCardHeader projected', async () => {
      const fix = await setup();
      fix.componentInstance.hasHeader = false;
      fix.detectChanges();

      const sections = getSections(fix);
      expect(sections.length).toBe(2); // body + footer
      const body = getBody(fix);
      expect(body?.textContent?.trim()).toContain('Body content');
    });

    it('hides footer when no tngCardFooter projected', async () => {
      const fix = await setup();
      fix.componentInstance.hasFooter = false;
      fix.detectChanges();

      const sections = getSections(fix);
      expect(sections.length).toBe(2); // header + body
    });
  });
});
