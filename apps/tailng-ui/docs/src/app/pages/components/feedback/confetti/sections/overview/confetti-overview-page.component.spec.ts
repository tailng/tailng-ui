import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfettiOverviewPageComponent } from './confetti-overview-page.component';

describe('ConfettiOverviewPageComponent', () => {
  let fixture: ComponentFixture<ConfettiOverviewPageComponent>;

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => ({ matches: false }) as MediaQueryList),
    });
    fixture = TestBed.configureTestingModule({
      imports: [ConfettiOverviewPageComponent],
    }).createComponent(ConfettiOverviewPageComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    fixture.destroy();
  });

  it('renders Plain-CSS and Tailwind CSS overview variants', () => {
    const root = fixture.nativeElement as HTMLElement;
    const tabList = root.querySelector<HTMLElement>(
      'app-docs-example-tabs-section [data-slot="tab-list"]',
    );
    const labels = Array.from(
      tabList?.querySelectorAll<HTMLElement>(':scope > [data-slot="tab"]') ?? [],
      (element) => element.textContent.trim(),
    );
    expect(labels).toEqual(['Plain-CSS', 'Tailwind CSS']);
  });

  it('keeps the two live preview states independent', () => {
    vi.useFakeTimers();
    const root = fixture.nativeElement as HTMLElement;
    const plainButton = root.querySelector<HTMLButtonElement>(
      '.confetti-overview-preview--plain button',
    );
    const tailwindButton = Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.classList.contains('bg-blue-600'),
    );

    expect(plainButton).not.toBeNull();
    expect(tailwindButton).toBeDefined();
    plainButton?.click();
    vi.runAllTicks();
    fixture.detectChanges();

    const overlays = root.querySelectorAll('[data-slot="confetti"]');
    expect(overlays).toHaveLength(1);
  });
});
