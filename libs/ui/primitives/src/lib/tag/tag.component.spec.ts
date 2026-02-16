// tag.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TngTag } from './tag.component';

const getSpan = (fix: ComponentFixture<TngTag>): HTMLSpanElement =>
  fix.nativeElement.querySelector('span') as HTMLSpanElement;

describe('TngTag', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  const setup = async () => {
    await TestBed.configureTestingModule({ imports: [TngTag] }).compileComponents();
    const fix = TestBed.createComponent(TngTag);
    return fix;
  };

  describe('Label', () => {
    it('displays label text', async () => {
      const fix = await setup();

      fix.componentRef.setInput('label', 'Test Tag');
      fix.detectChanges();

      expect(getSpan(fix).textContent?.trim()).toBe('Test Tag');
    });

    it('updates when label changes', async () => {
      const fix = await setup();

      fix.componentRef.setInput('label', 'Test Tag');
      fix.detectChanges();

      fix.componentRef.setInput('label', 'Updated');
      fix.detectChanges();

      expect(getSpan(fix).textContent?.trim()).toBe('Updated');
    });
  });

  describe('Color variants', () => {
    it('applies default color classes', async () => {
      const fix = await setup();

      fix.componentRef.setInput('label', 'Test Tag');
      fix.componentRef.setInput('color', 'default');
      fix.detectChanges();

      const span = getSpan(fix);
      expect(span.className).toContain('bg-gray-100');
      expect(span.className).toContain('text-gray-800');
    });

    it('applies primary color classes', async () => {
      const fix = await setup();

      fix.componentRef.setInput('color', 'primary');
      fix.detectChanges();

      const span = getSpan(fix);
      expect(span.className).toContain('bg-blue-100');
      expect(span.className).toContain('text-blue-800');
    });

    it('applies success color classes', async () => {
      const fix = await setup();

      fix.componentRef.setInput('color', 'success');
      fix.detectChanges();

      expect(getSpan(fix).className).toContain('bg-green-100');
    });

    it('applies danger color classes', async () => {
      const fix = await setup();

      fix.componentRef.setInput('color', 'danger');
      fix.detectChanges();

      expect(getSpan(fix).className).toContain('bg-red-100');
    });
  });

  describe('Disabled', () => {
    it('applies disabled classes when disabled', async () => {
      const fix = await setup();

      fix.componentRef.setInput('disabled', true);
      fix.detectChanges();

      const span = getSpan(fix);
      expect(span.className).toContain('opacity-50');
      expect(span.className).toContain('cursor-not-allowed');
    });

    it('applies cursor-default when not disabled', async () => {
      const fix = await setup();

      fix.componentRef.setInput('disabled', false);
      fix.detectChanges();

      expect(getSpan(fix).className).toContain('cursor-default');
    });
  });

  describe('Base classes', () => {
    it('applies base layout classes', async () => {
      const fix = await setup();
      fix.detectChanges();

      const span = getSpan(fix);
      expect(span.className).toContain('flex');
      expect(span.className).toContain('items-center');
      expect(span.className).toContain('rounded-md');
      expect(span.className).toContain('px-3');
      expect(span.className).toContain('py-1');
      expect(span.className).toContain('text-xs');
      expect(span.className).toContain('font-bold');
    });
  });

  describe('Slot hooks', () => {
    it('applies container slot classes', async () => {
      const fix = await setup();

      fix.componentRef.setInput('slot', { container: 'custom-container shadow-md' });
      fix.detectChanges();

      const span = getSpan(fix);
      expect(span.className).toContain('custom-container');
      expect(span.className).toContain('shadow-md');
      expect(span.className).toContain('bg-gray-100');
    });

    it('handles empty slot object', async () => {
      const fix = await setup();

      fix.componentRef.setInput('slot', {});
      fix.detectChanges();

      const span = getSpan(fix);
      expect(span.className).toContain('flex');
      expect(span.className).toContain('bg-gray-100');
    });
  });
});