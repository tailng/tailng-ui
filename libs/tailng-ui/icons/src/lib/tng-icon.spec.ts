import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { createTngIconPack, provideTngIcons } from './icons';
import { TngIcon } from './tng-icon';

const testIconPack = createTngIconPack('test', {
  bell: async (): Promise<string> => '<svg viewBox="0 0 24 24"><path d="M12 2v2"></path></svg>',
  check: async (): Promise<string> =>
    '<svg viewBox="0 0 24 24"><path d="m4 12 5 5L20 6"></path></svg>',
  unsafe: async (): Promise<string> => '<svg><script>alert(1)</script></svg>',
});

function getByTestId<TElement extends HTMLElement>(
  fixture: { nativeElement: HTMLElement },
  testId: string,
): TElement {
  const element = fixture.nativeElement.querySelector(`[data-testid="${testId}"]`);
  expect(element).not.toBeNull();
  return element as TElement;
}

async function render<TComponent>(component: new (...args: never[]) => TComponent) {
  const fixture = TestBed.configureTestingModule({
    imports: [component],
    providers: [
      provideTngIcons({
        defaultPack: 'test',
        packs: [testIconPack],
      }),
    ],
  }).createComponent(component);

  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  return fixture;
}

@Component({
  imports: [TngIcon],
  template: `<tng-icon data-testid="icon" icon="bell" size="24" />`,
})
class StaticSizeHostComponent {}

@Component({
  imports: [TngIcon],
  template: `<tng-icon data-testid="icon" icon="bell" [size]="size()" />`,
})
class DynamicSizeHostComponent {
  public readonly size = signal<string | number | null | undefined>('1.25rem');
}

@Component({
  imports: [TngIcon],
  template: `<tng-icon data-testid="icon" [icon]="icon()" />`,
})
class DynamicIconHostComponent {
  public readonly icon = signal('bell');
}

@Component({
  imports: [TngIcon],
  template: `<tng-icon data-testid="icon" icon="missing" size="2rem" />`,
})
class FallbackSizeHostComponent {}

@Component({
  imports: [TngIcon],
  template: `<tng-icon data-testid="icon" icon="unsafe" />`,
})
class UnsafeIconHostComponent {}

@Component({
  imports: [TngIcon],
  template: `
    <tng-icon data-testid="decorative" icon="bell" />
    <tng-icon data-testid="labelled" icon="bell" label="Search" />
  `,
})
class AccessibilityHostComponent {}

describe('tng-icon component', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('sets numeric string size values as pixel custom properties', async () => {
    const fixture = await render(StaticSizeHostComponent);
    const host = getByTestId<HTMLElement>(fixture, 'icon');
    const renderedIcon = host.querySelector<HTMLElement>('.tng-icon__svg');
    const svg = renderedIcon?.querySelector('svg');

    expect(host.style.getPropertyValue('--tng-icon-size')).toBe('24px');
    expect(host.hasAttribute('ngskiphydration')).toBe(true);
    expect(renderedIcon).not.toBeNull();
    expect(svg?.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(svg?.getAttribute('height')).toBe('100%');
    expect(svg?.getAttribute('width')).toBe('100%');
  });

  it('updates and clears dynamic size values', async () => {
    const fixture = await render(DynamicSizeHostComponent);
    const host = getByTestId<HTMLElement>(fixture, 'icon');

    expect(host.style.getPropertyValue('--tng-icon-size')).toBe('1.25rem');

    fixture.componentInstance.size.set(32);
    fixture.detectChanges();
    expect(host.style.getPropertyValue('--tng-icon-size')).toBe('32px');

    fixture.componentInstance.size.set(null);
    fixture.detectChanges();
    expect(host.style.getPropertyValue('--tng-icon-size')).toBe('');
  });

  it('replaces the rendered SVG when the icon input changes', async () => {
    const fixture = await render(DynamicIconHostComponent);
    const host = getByTestId<HTMLElement>(fixture, 'icon');

    expect(host.querySelector('path')?.getAttribute('d')).toBe('M12 2v2');

    fixture.componentInstance.icon.set('check');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.querySelectorAll('svg')).toHaveLength(1);
    expect(host.querySelector('path')?.getAttribute('d')).toBe('m4 12 5 5L20 6');
  });

  it('uses the same custom property for the fallback icon', async () => {
    const fixture = await render(FallbackSizeHostComponent);
    const host = getByTestId<HTMLElement>(fixture, 'icon');
    const fallback = host.querySelector<HTMLElement>('.tng-icon__fallback');

    expect(host.style.getPropertyValue('--tng-icon-size')).toBe('2rem');
    expect(fallback).not.toBeNull();
    expect(fallback?.classList.contains('tng-icon__fallback')).toBe(true);
    expect(host.querySelector('.tng-icon__svg')).toBeNull();
  });

  it('uses the fallback when a registered icon fails SVG validation', async () => {
    const fixture = await render(UnsafeIconHostComponent);
    const host = getByTestId<HTMLElement>(fixture, 'icon');

    expect(host.querySelector('svg')).toBeNull();
    expect(host.querySelector('.tng-icon__fallback')).not.toBeNull();
  });

  it('keeps decorative and labelled accessibility attributes unchanged', async () => {
    const fixture = await render(AccessibilityHostComponent);
    const decorativeIcon = getByTestId<HTMLElement>(fixture, 'decorative').querySelector(
      '.tng-icon__svg',
    );
    const labelledIcon = getByTestId<HTMLElement>(fixture, 'labelled').querySelector(
      '.tng-icon__svg',
    );

    expect(decorativeIcon?.getAttribute('aria-hidden')).toBe('true');
    expect(decorativeIcon?.getAttribute('aria-label')).toBeNull();
    expect(labelledIcon?.getAttribute('aria-hidden')).toBeNull();
    expect(labelledIcon?.getAttribute('aria-label')).toBe('Search');
    expect(labelledIcon?.getAttribute('role')).toBe('img');
  });
});
